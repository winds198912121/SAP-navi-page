#!/bin/bash
# ============================================================
# SAP パンダ先生 — 自動バックアップスクリプト
# crontab で每日実行: 0 3 * * * /path/to/deploy/scripts/backup.sh
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/deploy/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30  # バックアップ保存期間

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

# MySQL dump
MYSQL_SOCK="/tmp/sap-panda.sock"
if [ -S "$MYSQL_SOCK" ]; then
    mysqldump -S "$MYSQL_SOCK" -u wordpress -pwordpress wordpress \
      --single-transaction --quick --routines --triggers \
      > "$BACKUP_DIR/db_$TIMESTAMP.sql" 2>/dev/null
    gzip "$BACKUP_DIR/db_$TIMESTAMP.sql"
    echo "  ✅ Database: db_$TIMESTAMP.sql.gz ($(du -h "$BACKUP_DIR/db_$TIMESTAMP.sql.gz" | awk '{print $1}'))"
else
    echo "  ⚠️  MySQL not running"
fi

# WordPress uploads backup
WP_UPLOADS="$PROJECT_DIR/wordpress/wp-content/uploads"
if [ -d "$WP_UPLOADS" ]; then
    tar czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C "$(dirname "$WP_UPLOADS")" uploads/
    echo "  ✅ Uploads: uploads_$TIMESTAMP.tar.gz ($(du -h "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" | awk '{print $1}'))"
fi

# 古いバックアップを削除
find "$BACKUP_DIR" -name "db_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "uploads_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Backup complete. (retention: ${RETENTION_DAYS}days)"
