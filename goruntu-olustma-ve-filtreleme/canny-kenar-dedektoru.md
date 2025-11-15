---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> "Non-Maximum Suppression" adımının temel amacı nedir ve bu adım olmasaydı Canny'nin çıktısı nasıl görünürdü?</p>
  <div class="quiz-explanation">
    <p>Temel amacı, `gradient magnitude`'undan elde edilen kalın, "bulanık" kenarları tek `pixel` kalınlığında keskin çizgilere dönüştürmektir. Bu adım olmasaydı, Canny'nin çıktısı nesnelerin etrafında aydınlık haleler veya kalın yollar gibi görünürdü, bu da kenarların yerini hassas bir şekilde belirlemeyi imkansız kılardı.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Canny algoritmasının tek bir `threshold` yerine iki `threshold` (Hysteresis) kullanmasının avantajı nedir?</p>
  <div class="quiz-explanation">
    <p>Tek bir yüksek `threshold` kullanmak, gürültüyü iyi eler ancak gerçek kenar çizgilerinde boşluklar bırakabilir (kenarın zayıf kısımları kaybolur). Tek bir düşük `threshold` kullanmak ise kenar devamlılığını sağlar ama çok fazla gürültüyü de kenar olarak kabul eder. Hysteresis yöntemi, bu iki dünyanın en iyisini birleştirir: Yüksek `threshold` ile güvenilir "strong edge"leri bularak başlar ve ardından bu güvenilir kenarlara bağlı olan daha zayıf ama yine de kenarın bir parçası olması muhtemel "weak edge"leri de alçak `threshold`'u kullanarak takip eder. Bu, hem gürültüye dayanıklı hem de devamlılığı olan kenarlar üretir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Canny algoritmasının ilk adımı olan Gaussian `smoothing`'deki `σ` (sigma) değerini değiştirmek çıktıyı nasıl etkiler?</p>
  <div class="quiz-explanation">
    <p>`σ` değeri, `smoothing`'in miktarını, dolayısıyla kenar tespitinin "ölçeğini" kontrol eder. Küçük bir `σ` değeri, daha az `smoothing` anlamına gelir ve bu da görüntüdeki ince detayların ve ince kenarların (gürültüyle birlikte) tespit edilmesini sağlar. Büyük bir `σ` değeri ise daha fazla `smoothing` yapar, gürültüyü daha iyi bastırır ancak ince detayları ve zayıf kenarları yok eder, sadece büyük ölçekli ve belirgin kenarların bulunmasını sağlar.</p>
  </div>
</div>
