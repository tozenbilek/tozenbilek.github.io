---
layout: default
title: 5. Özellik Tespiti ve Eşleştirme
nav_order: 6
has_children: true
---

# Özellik Tespiti ve Eşleştirme

`Image`'ler arasında `homography` veya `stereo disparity` gibi ilişkileri hesaplayabilmek için, önce iki `image` arasında karşılık gelen noktaları (`correspondences`) bulmamız gerekir. `Image`'in tamamını veya basit pencereleri karşılaştırmak yerine, `image`'in en "ilginç", "ayırt edici" ve "tekrarlanabilir" bölgelerini bulup bunları eşleştirmek çok daha verimli ve sağlam bir yaklaşımdır. Bu özel bölgelere **local features** denir.

Bu bölümde, `local feature`'ların ne olduğunu, `corner`'lar gibi basit `feature`'ların nasıl tespit edildiğini ve ardından `scale` ve `rotation` gibi dönüşümlere karşı dayanıklı olan SIFT (Scale-Invariant Feature Transform) gibi modern ve güçlü bir `feature detector` ve `descriptor`'ın nasıl çalıştığını derinlemesine inceleyeceğiz.
