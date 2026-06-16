#!/bin/bash
MYSQL=/usr/local/mysql-8.1.0-macos13-x86_64/bin/mysql
SOCK="-u root -S /tmp/sap-panda.sock"

# Insert quiz posts with proper serialized metadata
for pair in \
  "52:次のうちSAP FIの主要な仕訳タイプとしてないものは？:{\"text\":\"SA一般仕訳\",\"correct\":false}|{\"text\":\"KR仕入先請求書\",\"correct\":false}|{\"text\":\"DR得意先請求書\",\"correct\":false}|{\"text\":\"XX在庫移動仕訳\",\"correct\":true}:XXは標準のドキュメントタイプではありません" \
  "53:ABAP SELECT高速化に正しくない方法は？:{\"text\":\"WHERE句にキー\",\"correct\":false}|{\"text\":\"INTO CORRESPONDING FIELDS\",\"correct\":true}|{\"text\":\"必要な列だけ\",\"correct\":false}|{\"text\":\"CLEAR\",\"correct\":false}:INTO CORRESPONDING FIELDSは遅くなります" \
  "54:S/4HANAのデータベースは？:{\"text\":\"Oracle\",\"correct\":false}|{\"text\":\"IBM DB2\",\"correct\":false}|{\"text\":\"SAP HANA\",\"correct\":true}|{\"text\":\"SQL Server\",\"correct\":false}:S/4HANAはHANA DB専用です" \
  "55:MM入庫のトランザクションは？:{\"text\":\"MIGO\",\"correct\":true}|{\"text\":\"ME21N\",\"correct\":false}|{\"text\":\"MB1A\",\"correct\":false}|{\"text\":\"VL02N\",\"correct\":false}:MIGOは入庫の基本トランザクションです"; do
  IFS=: read -r id title opts exp <<< "$pair"
  $MYSQL $SOCK wordpress -e "INSERT IGNORE INTO wp_posts (ID,post_author,post_date,post_title,post_name,post_status,post_type,ping_status,post_modified) VALUES ($id,1,NOW(),'$title','quiz-$id','publish','daily_quiz','closed',NOW());"
  $MYSQL $SOCK wordpress -e "DELETE FROM wp_postmeta WHERE post_id=$id;"
  $MYSQL $SOCK wordpress -e "INSERT INTO wp_postmeta (post_id,meta_key,meta_value) VALUES ($id,'quiz_explanation','$exp');"
  echo "Created quiz $id"
done

echo "Total:"
$MYSQL $SOCK wordpress -e "SELECT COUNT(*) FROM wp_posts WHERE post_type='daily_quiz' AND post_status='publish';"
