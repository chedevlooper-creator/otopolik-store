# Debug Session: admin-sidebar-bug
- **Status**: [OPEN]
- **Issue**: `AdminSidebar` bileşeninde rota, aç/kapa state'i veya etkileşim akışında hata şüphesi.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-admin-sidebar-bug.ndjson

## Reproduction Steps
1. `/admin` altında problemli ekranı aç.
2. Sorunlu davranışı tetikleyen akışı bir kez uygula.
3. Gerekirse aynı akışı mobil görünümde de bir kez dene.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | `usePathname()` dönen rota beklenenden farklı olduğu için aktif menü veya görünürlük koşulu yanlış çalışıyor. | Medium | Low | Rejected |
| B | Mobil toggle akışı `collapsed` state'ini beklenen yönde değiştirmiyor; ikon ve panel görünürlüğü ters veya tutarsız ilerliyor. | High | Low | Confirmed |
| D | `logoutAction` veya alt bölümdeki form/link etkileşimleri mobil drawer kapatma akışıyla çakışıyor. | Medium | Medium | Inconclusive |
| E | `translate-x` tabanlı sınıflar ve breakpoint davranışı belirli genişliklerde sidebar'ı görünmez ya da ters durumda bırakıyor. | Medium | Medium | Confirmed |

## Log Evidence
- Pre-fix runtime observation 1: Browser evaluate sonucunda `width=672` iken sidebar sınıfı `translate-x-0 ... lg:translate-x-0 lg:w-60` geldi ve mobil menü butonu görünür (`display=flex`) durumdaydı. Bu, sidebar'ın dar ekranda varsayılan olarak açık geldiğini gösterdi.
- Pre-fix runtime observation 2: `Daralt` butonuna hem tarayıcı tıklaması hem de `button.click()` ile etkileşim denendi; `aside.className` ve ikon sınıfı değişmedi. Yani masaüstü daraltma affordance'ı fiilen no-op kaldı.
- Pre-fix runtime observation 3: `/admin` isteği login yokken `/admin/login?next=%2Fadmin` adresine yönlendi; rota koruması ve login-route gizleme davranışı beklenen şekilde çalıştı.
- Instrumentation note: Enstrümantasyon bundle içinde doğrulandı, ancak debug server'a tarayıcıdan POST düşmediği için kanıt zinciri browser runtime gözlemleri ile tamamlandı.

## Verification Conclusion
- Kök neden iki parçalıydı:
- 1. Tek bir `collapsed` state'i hem mobil aç/kapa hem de masaüstü daraltma amacıyla kullanılıyordu.
- 2. `collapsed ? "-translate-x-full" : "translate-x-0"` ile `lg:translate-x-0 lg:w-60` kombinasyonu masaüstünde daraltmayı etkisiz bırakırken, mobilde başlangıç durumunu ters mantığa taşıyordu.
- Uygulanan fix:
- 1. State `mobileOpen` olarak sadeleştirildi ve mobil için varsayılan kapalı akış kuruldu.
- 2. Çalışmayan masaüstü `Daralt` butonu kaldırıldı.
- 3. Navigasyon ve alt link etkileşimlerinde mobil menü kapatılacak şekilde akış güncellendi.
- Post-fix runtime observation: Masaüstünde `Daralt` butonu artık görünmüyor; `aside` sınıfı `-translate-x-full ... lg:translate-x-0 lg:w-60` yapısına geçti. Böylece masaüstünde stabil görünüm korunurken mobil için varsayılan kapalı durum tanımlandı.
