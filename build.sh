#!/usr/bin/bash

for f in js/*.js; do
  html=${f%.*}.html
  echo "<script>" > $html
  cat $f >> $html
  echo "</script>" >> $html
done

for g in css/*.css; do
  html=${g%.*}.html
  echo "<style>" > $html
  cat $g >> $html
  echo "</style>" >> $html
done