//! Arayüz elementlerini seçme
const ad = document.getElementById('ad');
const soyad = document.getElementById('soyad');
const mail = document.getElementById('mail');

const form = document.getElementById('form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi')

//! Event Listeners (Olay Dinleyicileri) tanımlaması
form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriYap);

//! tüm kişiler için dizi oluşturuldu
const tumKisiler = [];
let secilenSatir = undefined;

function kisiIslemleriYap(event) {
    if (event.target.classList.contains('btn--delete')) {
        const silinecekKisi = event.target.parentElement.parentElement;
        const silinecekKisiMail = event.target.parentElement.previousElementSibling.textContent;
        rehberdenSil(silinecekKisi, silinecekKisiMail);
    } else if (event.target.classList.contains('btn--edit')) {
        document.querySelector('.kaydetGuncelle').value = 'Güncelle';
        const secilenTr = event.target.parentElement.parentElement;
        //? cells[2] -> mail adresine göre güncelleme yapılacak. cells hucre mantığıyla çalışır. 0. index ad, 1. index soyad, 2. index mail adresine karşılık geliyor burada.
        const guncellecekMail = secilenTr.cells[2].textContent;

        ad.value = secilenTr.cells[0].textContent;
        soyad.value = secilenTr.cells[1].textContent;
        mail.value = secilenTr.cells[2].textContent;

        secilenSatir = secilenTr;
    }

}

function rehberdenSil(silinecekKisi, silinecekKisiMail) {
    silinecekKisi.remove();
    //! Mail adresine göre kişi silme işlemi
    // tumKisiler.forEach((kisi, index) => {
    //     if (kisi.mail === silinecekKisiMail) tumKisiler.splice(index, 1);
    // })
    const silinmeyecekKisiler = tumKisiler.filter(function (kisi, index) {
        return kisi.mail !== silinecekKisiMail;
    });

    tumKisiler.length = 0;
    tumKisiler.push(...silinmeyecekKisiler);
    alanlariTemizle();
    document.querySelector('.kaydetGuncelle').value = 'Kaydet';
}

function kaydet(e) {
    e.preventDefault();

    const eklenecekVeyaGüncellenecekKisi = {
        ad: ad.value,
        soyad: soyad.value,
        mail: mail.value
    }
    const sonuc = verileriKontrolEt(eklenecekVeyaGüncellenecekKisi);

    if (sonuc.durum) {
        if (secilenSatir) {
            kisiyiGuncelle(eklenecekVeyaGüncellenecekKisi);
        } else {
            kisiyiEkle(eklenecekVeyaGüncellenecekKisi);
        }
    } else {
        bilgiOluştur(sonuc.mesaj, sonuc.durum);
    }
}

function kisiyiGuncelle(kisi) {
    //todo: kisi parametresi güncellenecek kişinin bilgilerini içeriyor. Seçilen satırda eski bilgiler var. Bu bilgileri güncel bilgilerle değiştirmemiz gerekiyor.

    for (let i = 0; i < tumKisiler.length; i++) {
        if (tumKisiler[i].mail === secilenSatir.cells[2].textContent) {
            tumKisiler[i] = kisi;
            break;
        }
    }
    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[1].textContent = kisi.soyad;
    secilenSatir.cells[2].textContent = kisi.mail;
    document.querySelector('.kaydetGuncelle').value = 'Kaydet';
    //* Güncelleme yaptıktan sonra seçili olan satırı sıfırlıyoruz. Bu sayede yeni kişi ekleme işlemi yapılabilir.
    secilenSatir = undefined;
}

function kisiyiEkle(eklenecekKisi) {
    const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML = `
        <td>${eklenecekKisi.ad}</td>
        <td>${eklenecekKisi.soyad}</td>
        <td>${eklenecekKisi.mail}</td>
        <td><button class="btn btn--edit">
                <i class="far fa-edit"></i>
            </button>
            <button class="btn btn--delete">
                <i class="far fa-trash-alt"></i>
            </button>
        </td>`;
    kisiListesi.appendChild(olusturulanTrElementi);
    tumKisiler.push(eklenecekKisi);
    bilgiOluştur('Kisi başarıyla eklendi.', true);
}


function verileriKontrolEt(kisi) {
    //? objelerde in kullanımı
    for (const deger in kisi) {
        if (kisi[deger]) {
            console.log(kisi[deger]);
        } else {
            const sonuc = {
                durum: false,
                mesaj: 'Lütfen tüm alanları doldurunuz.'
            }
            return sonuc;
        }
    }
    alanlariTemizle();
    return {
        durum: true,
        mesaj: 'Kişi başarıyla eklendi.'
    }
}

function bilgiOluştur(mesaj, durum) {
    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = `bilgi ${durum ? 'bilgi--success' : 'bilgi--error'}`;
    document.querySelector('.container').insertBefore(olusturulanBilgi, form);
    //? setTimeout , setInterval

    setTimeout(() => {
        olusturulanBilgi.remove();
    }, 2000);
}

function alanlariTemizle() {
    ad.value = '';
    soyad.value = '';
    mail.value = '';
}