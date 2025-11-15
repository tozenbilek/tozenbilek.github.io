---
layout: default
title: 3. Hough Transform
nav_order: 4
has_children: true
---

# Hough Transform

`Edge` `pixel`'lerini bulduktan sonraki adım, bu `pixel`'leri anlamlı geometrik şekillere (`line`'lar, `circle`'lar vb.) gruplamaktır. `Image`'deki `noise`, eksik parçalar ve alakasız diğer `edge`'ler bu işlemi zorlaştırır. **Hough Transform**, bu zorlukların üstesinden gelmek için tasarlanmış güçlü bir **voting** tekniğidir.

Bu bölümde, `Hough Transform`'un arkasındaki temel mantığı, `line`'ları ve `circle`'ları nasıl tespit ettiğini ve daha karmaşık şekilleri bulmak için nasıl genelleştirilebileceğini öğreneceğiz.
