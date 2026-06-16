#!/bin/bash
# Seed term meta for SAP modules (color, icon, order)
MYSQL=/usr/local/mysql-8.1.0-macos13-x86_64/bin/mysql
SOCK="-u root -S /tmp/sap-panda.sock wordpress"

for slug in fi co mm sd pp hr abap basis s4; do
  tid=$($MYSQL $SOCK -N -e "SELECT t.term_id FROM wp_terms t JOIN wp_term_taxonomy tt ON t.term_id=tt.term_id WHERE tt.taxonomy='sap_module' AND t.slug='$slug' LIMIT 1;")
  [ -z "$tid" ] && continue

  case $slug in
    fi)    c="#2f6d44" b="#d8ead9" i="FI"    o=1;;
    co)    c="#2641a1" b="#dde4fc" i="CO"    o=2;;
    mm)    c="#a25411" b="#fde0c2" i="MM"    o=3;;
    sd)    c="#b62a4a" b="#ffdfe6" i="SD"    o=4;;
    pp)    c="#4828a8" b="#e4dffb" i="PP"    o=5;;
    hr)    c="#8a6212" b="#fee9b3" i="HR"    o=6;;
    abap)  c="#1f6f6f" b="#cfecec" i="ABAP"  o=7;;
    basis) c="#4a432d" b="#e3e1d8" i="Basis" o=8;;
    s4)    c="#1864a3" b="#d1ecf9" i="S/4"   o=9;;
  esac

  $MYSQL $SOCK -e "INSERT INTO wp_termmeta (term_id, meta_key, meta_value) VALUES
    ($tid, 'module_color', '$c'),
    ($tid, 'module_bg_color', '$b'),
    ($tid, 'module_icon', '$i'),
    ($tid, 'module_order', '$o')
    ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);" 2>/dev/null
  echo "✅ $slug (tid=$tid) icon=$i color=$c"
done
echo "Done"
