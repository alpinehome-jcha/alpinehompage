$f = "pages\admin.html"
$t = $f + ".tmp"
$c = Get-Content $f
$p1 = $c[0..317]
$p2 = $c[364..($c.Count - 1)]

$p1 | Out-File $t -Encoding UTF8
$p2 | Out-File $t -Encoding UTF8 -Append
Move-Item -Force $t $f
