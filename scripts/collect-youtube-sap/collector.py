#!/usr/bin/env python3
"""
YouTube SAP Video Collector
============================
YouTube Data API v3 を使って SAP 関連動画を検索・収集し、
SAP モジュールごとに分類して JSON にエクスポートします。

使い方:
    # APIキーを設定
    export YOUTUBE_API_KEY="your_api_key_here"

    # 全モジュール収集を実行
    python3 collector.py

    # 特定モジュールのみ (カンマ区切り)
    python3 collector.py --modules fi,abap,s4

    # 出力ファイル指定
    python3 collector.py --output ../youtube-sap-videos.json

必要パッケージ: google-api-python-client, requests (どちらもプリインストール済み)
"""

import os
import sys
import json
import time
import re
import argparse
import logging
from datetime import datetime, timezone
from typing import Optional
from pathlib import Path

# === Logging ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# === 設定読み込み ===
CONFIG_PATH = Path(__file__).parent / "config.json"
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    CONFIG = json.load(f)

MODULES = CONFIG["modules"]
SETTINGS = CONFIG["settings"]
MAX_PER_MODULE = SETTINGS["max_videos_per_module"]
MIN_PER_MODULE = SETTINGS["min_videos_per_module"]
MAX_PAGES = SETTINGS["max_pages_per_query"]
MAX_RESULTS = SETTINGS["results_per_page"]

# === YouTube API ===
API_KEY = os.environ.get("YOUTUBE_API_KEY") or os.environ.get("YT_API_KEY")
if not API_KEY:
    log.error("YOUTUBE_API_KEY が設定されていません。")
    log.error("  export YOUTUBE_API_KEY='your_key'")
    log.error("Google Cloud Console → APIs & Services → Credentials で取得してください。")
    sys.exit(1)

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    log.error("google-api-python-client が必要です。 pip install google-api-python-client")
    sys.exit(1)

youtube = build("youtube", "v3", developerKey=API_KEY)

# === プログレスバー ===
class Progress:
    """シンプルな進捗表示"""
    def __init__(self, total: int, label: str = ""):
        self.total = total
        self.current = 0
        self.label = label
        self.start_time = time.time()

    def update(self, n: int = 1):
        self.current += n
        if self.total > 0:
            pct = int(self.current / self.total * 100)
            bar = "█" * (pct // 5) + "░" * (20 - pct // 5)
            elapsed = time.time() - self.start_time
            rate = self.current / elapsed if elapsed > 0 else 0
            eta = (self.total - self.current) / rate if rate > 0 else 0
            print(f"\r  {self.label} [{bar}] {self.current}/{self.total} {pct}% | η {eta:.0f}s", end="")
            if self.current >= self.total:
                print()


# ============================================================
#  1. キーワード分類
# ============================================================

def classify_video(title: str, description: str, search_module: str) -> str:
    """
    タイトルと説明文からSAPモジュールを判定する。
    キーワードマッチングで最もスコアの高いモジュールを返す。
    明確なマッチがなければ検索元モジュールをそのまま使う。
    """
    text = (title + " " + description).lower()
    scores = {}

    for mod_key, mod_data in MODULES.items():
        score = 0
        for kw in mod_data["keywords"]:
            # 単語の出現回数をカウント
            count = text.count(kw.lower())
            score += count
        if score > 0:
            scores[mod_key] = score

    if not scores:
        return search_module

    # 最高スコアのモジュール
    best = max(scores, key=scores.get)
    best_score = scores[best]
    search_score = scores.get(search_module, 0)

    # search_module のスコアが最高スコアの 50% 未満なら再分類
    if search_module != best and search_score < best_score * 0.5:
        return best

    return search_module


# ============================================================
#  2. YouTube 検索
# ============================================================

def search_youtube(query: str, page_token: str = None) -> Optional[dict]:
    """YouTube Data API v3 search.list を呼び出す"""
    try:
        request = youtube.search().list(
            part="snippet",
            q=query,
            type="video",
            maxResults=MAX_RESULTS,
            pageToken=page_token,
            relevanceLanguage="ja",
            videoDuration="any",
            order="relevance",
        )
        response = request.execute()
        return response
    except HttpError as e:
        if e.resp.status == 403:
            body = json.loads(e.content.decode()) if e.content else {}
            reason = body.get("error", {}).get("errors", [{}])[0].get("reason", "")
            if reason == "quotaExceeded":
                log.error("  クォータ超過！明日まで待つか、追加クォータを申請してください。")
            else:
                log.error(f"  API 403エラー: {reason}")
        else:
            log.error(f"  APIエラー: {e}")
        return None
    except Exception as e:
        log.error(f"  検索エラー: {e}")
        return None


def get_video_details(video_ids: list[str]) -> dict:
    """
    videos.list で複数動画の詳細情報を一括取得。
    存在しない/削除された動画は結果から除外される。
    """
    if not video_ids:
        return {}

    result = {}
    # 50件ずつバッチ処理
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i:i + 50]
        try:
            request = youtube.videos().list(
                part="snippet,contentDetails,statistics,status",
                id=",".join(batch),
            )
            response = request.execute()
            for item in response.get("items", []):
                vid = item["id"]
                snippet = item.get("snippet", {})
                content = item.get("contentDetails", {})
                stats = item.get("statistics", {})
                status = item.get("status", {})

                # プライベート/削除済みは除外
                privacy = status.get("privacyStatus", "")
                upload_status = status.get("uploadStatus", "")
                if privacy == "private" or upload_status in ("rejected", "failed"):
                    continue

                result[vid] = {
                    "title": snippet.get("title", ""),
                    "description": snippet.get("description", ""),
                    "channel_title": snippet.get("channelTitle", ""),
                    "published_at": snippet.get("publishedAt", ""),
                    "duration_iso": content.get("duration", ""),
                    "duration": parse_duration_iso(content.get("duration", "PT0S")),
                    "views": int(stats.get("viewCount", 0)),
                    "like_count": int(stats.get("likeCount", 0)),
                    "comment_count": int(stats.get("commentCount", 0)),
                    "category_id": snippet.get("categoryId", ""),
                    "tags": snippet.get("tags", []),
                    "thumbnail": f"https://img.youtube.com/vi/{vid}/mqdefault.jpg",
                    "embed_allowed": status.get("embeddable", True),
                }
        except HttpError as e:
            if e.resp.status == 403:
                log.warning("  クォータ超過警告 (videos.list)")
            else:
                log.warning(f"  詳細取得エラー ID={batch[0]}: {e}")
        except Exception as e:
            log.warning(f"  詳細取得例外: {e}")

        # レート制限回避
        time.sleep(0.1)

    return result


def parse_duration_iso(iso: str) -> str:
    """ISO 8601 期間形式 (PT32M15S) → 表示用文字列 (32:15)"""
    if not iso:
        return "0:00"
    try:
        m = re.search(r"PT?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso)
        if not m:
            return "0:00"
        h = int(m.group(1) or 0)
        mins = int(m.group(2) or 0)
        secs = int(m.group(3) or 0)
        if h > 0:
            return f"{h}:{mins:02d}:{secs:02d}"
        return f"{mins}:{secs:02d}"
    except Exception:
        return "0:00"


# ============================================================
#  3. モジュール別収集
# ============================================================

def collect_module_videos(module_key: str) -> list[dict]:
    """
    特定モジュールの動画を収集する。
    複数クエリで検索し、重複除去・分類・検証を行う。
    """
    mod = MODULES[module_key]
    queries = mod["queries"]

    log.info(f"\n{'='*60}")
    log.info(f"  {mod['code']} ({mod['name']}) - 収集開始")
    log.info(f"{'='*60}")

    # 全クエリの中間結果を保持 (video_id → info)
    collected: dict[str, dict] = {}

    for qi, query in enumerate(queries, 1):
        log.info(f"  クエリ [{qi}/{len(queries)}]: 「{query}」")

        page_token = None
        page_count = 0
        found_in_query = 0

        while page_count < MAX_PAGES:
            response = search_youtube(query, page_token)
            if response is None:
                break

            items = response.get("items", [])
            if not items:
                log.info(f"    ページ {page_count+1}: 結果なし")
                break

            # 検索結果から video_id を収集（重複は弾く）
            new_ids = []
            for item in items:
                vid = item["id"]["videoId"]
                if vid not in collected:
                    snippet = item.get("snippet", {})
                    collected[vid] = {
                        "youtube_id": vid,
                        "title": snippet.get("title", ""),
                        "description": snippet.get("description", ""),
                        "channel_title": snippet.get("channelTitle", ""),
                        "published_at": snippet.get("publishedAt", ""),
                        "thumbnail": f"https://img.youtube.com/vi/{vid}/mqdefault.jpg",
                        "search_module": module_key,
                        "_search_query": query,
                    }
                    new_ids.append(vid)

            found_in_query += len(new_ids)
            page_count += 1

            log.info(f"    ページ {page_count}: {len(new_ids)}件 新規 / 累計 {len(collected)}件")

            # 目標数に達したら早期終了
            if len(collected) >= MAX_PER_MODULE * 1.5:
                log.info(f"    十分な件数 ({len(collected)}) を収集したため終了")
                break

            page_token = response.get("nextPageToken")
            if not page_token:
                break

            # ページ間のウェイト（レート制限）
            time.sleep(0.3)

        log.info(f"  → クエリ完了: {found_in_query}件 追加")

        if len(collected) >= MAX_PER_MODULE * 2:
            log.info(f"  目標上限に達したためクエリループを終了")
            break

    log.info(f"\n  収集完了: {len(collected)}件 (重複除去後)")

    # --- 詳細検証 ---
    log.info(f"  動画詳細を検証中...")
    all_ids = list(collected.keys())

    # バッチで詳細取得
    details = {}
    for i in range(0, len(all_ids), 50):
        batch = all_ids[i:i + 50]
        batch_details = get_video_details(batch)
        details.update(batch_details)
        pct = min(100, int((i + 50) / len(all_ids) * 100))
        print(f"\r    検証進捗: {len(details)}/{len(all_ids)} {pct}%", end="")
    print()

    # 検証結果に基づきフィルタリング
    verified = []
    skipped_no_detail = 0
    skipped_short = 0
    skipped_embed = 0

    for vid, info in collected.items():
        if vid not in details:
            skipped_no_detail += 1
            continue

        det = details[vid]

        # 60秒未満の動画はスキップ（ショート動画対策）
        dur_parts = det["duration"].split(":")
        total_secs = 0
        try:
            if len(dur_parts) == 3:
                total_secs = int(dur_parts[0]) * 3600 + int(dur_parts[1]) * 60 + int(dur_parts[2])
            elif len(dur_parts) == 2:
                total_secs = int(dur_parts[0]) * 60 + int(dur_parts[1])
        except ValueError:
            total_secs = 0

        if total_secs < 60:
            skipped_short += 1
            continue

        # 埋め込み禁止はスキップ
        if not det.get("embed_allowed", True):
            skipped_embed += 1
            continue

        # モジュール分類
        assigned_module = classify_video(
            det["title"],
            det.get("description", info.get("description", "")),
            module_key,
        )

        verified.append({
            "youtube_id": vid,
            "title": det["title"],
            "description": det.get("description", ""),
            "channel_title": det.get("channel_title", ""),
            "duration": det["duration"],
            "duration_iso": det.get("duration_iso", ""),
            "views": det.get("views", 0),
            "like_count": det.get("like_count", 0),
            "comment_count": det.get("comment_count", 0),
            "thumbnail": det["thumbnail"],
            "tags": det.get("tags", []),
            "published_at": det.get("published_at", ""),
            "module": assigned_module,
        })

    # 分類後のモジュール内訳
    module_counts = {}
    for v in verified:
        m = v["module"]
        module_counts[m] = module_counts.get(m, 0) + 1

    log.info(f"  検証結果:")
    log.info(f"    ✓ 有効: {len(verified)}")
    log.info(f"    ✗ 詳細取得不可: {skipped_no_detail}")
    log.info(f"    ✗ 60秒未満: {skipped_short}")
    log.info(f"    ✗ 埋め込み禁止: {skipped_embed}")
    log.info(f"    モジュール内訳: {json.dumps(module_counts)}")

    return verified


# ============================================================
#  4. 全体収集
# ============================================================

def collect_all(target_modules: list[str] = None) -> dict:
    """
    全モジュール（または指定モジュール）の動画を収集する。
    戻り値: modulesキーごとの動画リスト
    """
    if target_modules:
        modules_to_process = {k: MODULES[k] for k in target_modules if k in MODULES}
        if not modules_to_process:
            log.error(f"指定されたモジュールが見つかりません: {target_modules}")
            log.info(f"利用可能: {', '.join(MODULES.keys())}")
            return {}
    else:
        modules_to_process = MODULES

    log.info("=" * 60)
    log.info("  YouTube SAP 動画コレクター")
    log.info(f"  収集開始: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log.info(f"  対象モジュール: {', '.join(modules_to_process.keys())}")
    log.info(f"  目標: 各モジュール {MIN_PER_MODULE}～{MAX_PER_MODULE}件")
    log.info(f"  合計目標: ~{len(modules_to_process) * (MIN_PER_MODULE + MAX_PER_MODULE) // 2}件")
    log.info("=" * 60)

    # APIキー確認
    try:
        # クォータ確認用に軽いAPIコール
        request = youtube.videos().list(part="snippet", id="dQw4w9WgXcQ")
        request.execute()
        log.info("  ✓ API接続OK")
    except Exception as e:
        log.warning(f"  API接続確認: {e}")

    results = {}
    total_verified = 0

    for mod_key in modules_to_process:
        videos = collect_module_videos(mod_key)

        # モジュール分類後の再振り分け
        for v in videos:
            m = v["module"]
            if m not in results:
                results[m] = []
            results[m].append(v)

        # 各モジュールの進捗
        mod_name = MODULES[mod_key]["name"]
        our_count = len(videos)
        total_verified += our_count
        log.info(f"\n  ▶ {mod_name}: {our_count}件 収集 / 累計 {total_verified}件")

        # APIクォータ保護のためモジュール間で待機
        if mod_key != list(modules_to_process.keys())[-1]:
            log.info("  次のモジュールまで3秒待機...")
            time.sleep(3)

    # --- 上限調整（各モジュールMAX_PER_MODULEまで）---
    trimmed = {}
    total_trimmed = 0
    for mod_key, vids in results.items():
        mod_name = MODULES.get(mod_key, {}).get("name", mod_key.upper())
        if len(vids) > MAX_PER_MODULE:
            # views 順でソートして上位をキープ
            vids.sort(key=lambda x: x.get("views", 0), reverse=True)
            trimmed[mod_key] = vids[:MAX_PER_MODULE]
            trimmed_count = MAX_PER_MODULE
        else:
            trimmed[mod_key] = vids
            trimmed_count = len(vids)
        total_trimmed += trimmed_count
        log.info(f"  {mod_name}: {len(vids)} → {trimmed_count}件 (上限適用後)")

    log.info(f"\n{'='*60}")
    log.info(f"  収集完了!")
    log.info(f"  総収集数: {total_trimmed}件 / {len(trimmed)}モジュール")
    for mod_key, vids in trimmed.items():
        mod_name = MODULES.get(mod_key, {}).get("name", mod_key.upper())
        log.info(f"    {mod_name}: {len(vids)}件")
    log.info(f"  完了時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log.info(f"{'='*60}")

    return trimmed


# ============================================================
#  5. JSON エクスポート & 統計
# ============================================================

def export_json(data: dict, output_path: str):
    """収集結果をJSONにエクスポート"""
    total = sum(len(v) for v in data.values())

    export = {
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "total_videos": total,
        "total_modules": len(data),
        "settings": SETTINGS,
        "modules": {},
    }

    for mod_key, videos in data.items():
        # views 降順でソート
        videos_sorted = sorted(videos, key=lambda x: x.get("views", 0), reverse=True)
        export["modules"][mod_key] = videos_sorted

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(export, f, ensure_ascii=False, indent=2)

    log.info(f"\n  ✓ JSON出力: {output_path}")
    log.info(f"  ファイルサイズ: {os.path.getsize(output_path) / 1024 / 1024:.1f} MB")

    return export


def print_summary(data: dict):
    """収集サマリーを表示"""
    total = sum(len(v) for v in data.values())

    print()
    print("=" * 70)
    print("  📊  収集サマリー")
    print("=" * 70)
    print(f"  {'モジュール':<12} {'件数':<8} {'平均再生数':<15} {'総再生数':<15}")
    print(f"  {'─'*8:<12} {'─'*4:<8} {'─'*10:<15} {'─'*10:<15}")
    for mod_key, videos in sorted(data.items()):
        mod_name = MODULES.get(mod_key, {}).get("name", mod_key.upper())
        count = len(videos)
        avg_views = sum(v.get("views", 0) for v in videos) // max(count, 1)
        total_views = sum(v.get("views", 0) for v in videos)
        print(f"  {mod_name:<12} {count:<8} {avg_views:<15,} {total_views:<15,}")
    print(f"  {'─'*8:<12} {'─'*4:<8} {'─'*10:<15} {'─'*10:<15}")
    print(f"  {'合計':<12} {total:<8,}")
    print("=" * 70)


# ============================================================
#  メインエントリ
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description="YouTube SAP Video Collector — SAP関連動画を収集・分類",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
例:
  python3 collector.py
  python3 collector.py --modules fi,abap,s4
  python3 collector.py --output ../sap-videos.json --modules all
  python3 collector.py --min 250 --max 300
        """,
    )
    parser.add_argument(
        "--modules",
        type=str,
        default="all",
        help="処理するモジュール (カンマ区切り, または 'all' = 全9モジュール)",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=str(Path(__file__).parent.parent / "youtube-sap-videos.json"),
        help="出力JSONファイルパス (default: ../youtube-sap-videos.json)",
    )
    parser.add_argument(
        "--min",
        type=int,
        default=MIN_PER_MODULE,
        help=f"モジュール最低件数 (default: {MIN_PER_MODULE})",
    )
    parser.add_argument(
        "--max",
        type=int,
        default=MAX_PER_MODULE,
        help=f"モジュール最大件数 (default: {MAX_PER_MODULE})",
    )
    parser.add_argument(
        "--skip-export",
        action="store_true",
        help="JSON出力をスキップ（サマリーのみ表示）",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="詳細ログ出力",
    )

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # モジュール選択
    if args.modules.lower() == "all":
        target_modules = list(MODULES.keys())
    else:
        target_modules = [m.strip().lower() for m in args.modules.split(",")]
        invalid = [m for m in target_modules if m not in MODULES]
        if invalid:
            log.error(f"不明なモジュール: {invalid}")
            log.info(f"利用可能: {', '.join(MODULES.keys())}")
            sys.exit(1)

    # 設定上書き
    if args.min != MIN_PER_MODULE:
        SETTINGS["min_videos_per_module"] = args.min
    if args.max != MAX_PER_MODULE:
        SETTINGS["max_videos_per_module"] = args.max
        global MAX_PER_MODULE
        MAX_PER_MODULE = args.max

    # 実行
    start = time.time()
    results = collect_all(target_modules)
    elapsed = time.time() - start

    total = sum(len(v) for v in results.values())
    log.info(f"\n  処理時間: {elapsed:.0f}秒 ({elapsed/60:.1f}分)")

    if not results:
        log.error("動画が収集できませんでした。APIキーとクォータを確認してください。")
        sys.exit(1)

    # サマリー表示
    print_summary(results)

    # エクスポート
    if not args.skip_export:
        output_path = args.output
        export_json(results, output_path)
    else:
        log.info("  (JSON出力スキップ: --skip-export)")

    log.info("  完了!")


if __name__ == "__main__":
    main()
