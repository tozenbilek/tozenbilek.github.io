---
layout: default
title: 6. Image Segmentation
nav_order: 7
has_children: true
---

# Image Segmentation

**Image Segmentation**, bir `image`'i, her biri belirli bir `semantic` (anlamsal) veya `perceptual` (algısal) bütünlüğe sahip olan birden fazla bölgeye veya nesneye ayırma işlemidir. Amacımız, `image`'in temsilini, `pixel` seviyesinden `region` (bölge) seviyesine taşıyarak daha anlamlı ve analiz edilebilir bir hale getirmektir. Örneğin, bir `image`'deki "gökyüzü", "ağaç", "yol" gibi bölgeleri birbirinden ayırmak bir `segmentation` işlemidir.

Bu bölümde, `pixel`'leri `feature`'larına göre gruplayan `clustering`-tabanlı yaklaşımları ve `image`'i bir `graph` olarak modelleyerek bölgelere ayıran `graph-based` yöntemleri inceleyeceğiz.
