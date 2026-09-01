import type { Module } from './types';

export const CURRICULUM: Module[] = [
  {
    id: 'membaca',
    title: 'Membaca',
    icon: 'BookOpen',
    color: 'emerald',
    levels: [
      {
        level: 1,
        title: 'Membaca Kata Sederhana',
        chapters: [
          {
            id: 'm1l1c1',
            title: 'Mengenal Huruf Vokal',
            questions: [
              {
                q: 'Huruf vokal terdiri dari ...',
                options: ['a i u e o', 'b c d f g', 'p q r s t', 'm n l r k'],
                answer: 0,
                teksBacaan: 'A I U E O adalah huruf vokal. Huruf vokal adalah huruf yang bersuara.',
              },
              {
                q: 'Huruf apa yang ada di kata "buku"?',
                options: ['a', 'e', 'u', 'i'],
                answer: 2,
                teksBacaan: 'B-U-K-U. Bunyikan perlahan: bu - ku. Ada huruf U.',
              },
              {
                q: 'Kata "ibu" memiliki huruf vokal ...',
                options: ['a dan e', 'i dan u', 'o dan a', 'u dan i'],
                answer: 1,
                teksBacaan: 'I - B - U. Bunyikan: i - bu. Huruf vokalnya I dan U.',
              },
              {
                q: 'Manakah yang bukan huruf vokal?',
                options: ['a', 'i', 'b', 'u'],
                answer: 2,
                teksBacaan: 'Huruf vokal ada lima: A, I, U, E, O. B bukan huruf vokal.',
              },
            ],
          },
          {
            id: 'm1l1c2',
            title: 'Membaca Suku Kata',
            questions: [
              {
                q: 'Suku kata pada kata "mama" adalah ...',
                options: ['ma-ma', 'm-a-m-a', 'mam-a', 'm-ama'],
                answer: 0,
                teksBacaan: 'MA - MA. Kata "mama" terdiri dari dua suku kata: ma dan ma.',
              },
              {
                q: 'Kata "bola" terdiri dari suku kata ...',
                options: ['bo-la', 'b-ola', 'bol-a', 'b-o-l-a'],
                answer: 0,
                teksBacaan: 'BO - LA. Bunyikan perlahan: bo - la. Dua suku kata.',
              },
              {
                q: 'Suku kata "ta" + "ku" menjadi ...',
                options: ['taku', 'tak', 'tka', 'kuta'],
                answer: 0,
                teksBacaan: 'TA + KU = TAKU. Gabungkan suku kata: ta-ku menjadi "taku".',
              },
              {
                q: 'Kata "sate" suku katanya ...',
                options: ['sa-te', 'sat-e', 's-ate', 'sate'],
                answer: 0,
                teksBacaan: 'SA - TE. Bunyikan: sa - te. Dua suku kata.',
              },
            ],
          },
        ],
      },
      {
        level: 2,
        title: 'Membaca Kalimat Sederhana',
        chapters: [
          {
            id: 'm1l2c1',
            title: 'Kalimat Pendek',
            questions: [
              {
                q: '"Budi makan nasi." Siapa yang makan?',
                options: ['Nasi', 'Budi', 'Makan', 'Tidak tahu'],
                answer: 1,
                teksBacaan: 'Budi makan nasi. Budi adalah anak yang sedang makan nasi.',
              },
              {
                q: '"Ibu memasak di dapur." Di mana?',
                options: ['Pasar', 'Dapur', 'Ruang tamu', 'Halaman'],
                answer: 1,
                teksBacaan: 'Ibu memasak di dapur. Dapur adalah tempat memasak.',
              },
              {
                q: '"Adik minum susu." Apa yang diminum?',
                options: ['Air', 'Teh', 'Susu', 'Kopi'],
                answer: 2,
                teksBacaan: 'Adik minum susu. Adik sedang minum susu yang sehat.',
              },
              {
                q: '"Ayah pergi ke kantor." Pergi ke mana?',
                options: ['Pasar', 'Sekolah', 'Kantor', 'Lapangan'],
                answer: 2,
                teksBacaan: 'Ayah pergi ke kantor. Ayah bekerja di kantor.',
              },
            ],
          },
        ],
      },
      {
        level: 3,
        title: 'Memahami Cerita Pendek',
        chapters: [
          {
            id: 'm1l3c1',
            title: 'Membaca Cerita',
            questions: [
              {
                q: 'Dalam cerita "Kancil dan Buaya", kancil bersifat ...',
                options: ['bodoh', 'pintar', 'penakut', 'malas'],
                answer: 1,
                teksBacaan: 'Suatu hari, Kancil ingin menyeberangi sungai. Kancil pintar. Ia membujuk Buaya untuk berbaris di sungai, lalu Kancil melompati mereka satu per satu. Kancil berhasil menyeberang dengan selamat.',
                gayaSoal: 'soal_cerita',
              },
              {
                q: 'Tokoh utama biasanya muncul ...',
                options: ['di akhir', 'di tengah', 'di awal cerita', 'tidak muncul'],
                answer: 2,
                teksBacaan: 'Tokoh utama adalah pahlawan cerita. Ia biasanya muncul di awal cerita dan menjadi pusat cerita.',
              },
              {
                q: 'Akhir cerita disebut ...',
                options: ['awalan', 'penyelesaian', 'tengah', 'judul'],
                answer: 1,
                teksBacaan: 'Setiap cerita memiliki awal, tengah, dan akhir. Akhir cerita disebut penyelesaian, tempat masalah diselesaikan.',
              },
            ],
          },
        ],
      },
      {
        level: 4,
        title: 'Membaca Paragraf',
        chapters: [
          {
            id: 'm1l4c1',
            title: 'Memahami Paragraf',
            questions: [
              {
                q: 'Ide utama paragraf biasanya terletak di ...',
                options: ['kalimat pertama', 'tengah', 'akhir', 'judul'],
                answer: 0,
                teksBacaan: 'Paragraf adalah kumpulan kalimat yang membahas satu ide. Ide utama biasanya ada di kalimat pertama, lalu kalimat berikutnya menjelaskannya.',
              },
              {
                q: 'Paragraf yang baik terdiri dari minimal ... kalimat.',
                options: ['1', '2', '5', '10'],
                answer: 1,
                teksBacaan: 'Paragraf yang baik minimal terdiri dari 2 kalimat: kalimat ide utama dan kalimat penjelas.',
              },
            ],
          },
        ],
      },
      {
        level: 5,
        title: 'Membaca Pemahaman Lanjut',
        chapters: [
          {
            id: 'm1l5c1',
            title: 'Teks Panjang',
            questions: [
              {
                q: 'Saat membaca teks panjang, kita perlu ...',
                options: ['cepat-cepat', 'memahami isi', 'menghafal', 'dilompati'],
                answer: 1,
                teksBacaan: 'Membaca teks panjang berbeda dengan membaca singkat. Kita perlu memahami isi, menangkap ide penulis, dan menyimpulkan maknanya. Jangan terburu-buru, baca dengan tenang dan teliti.',
              },
              {
                q: 'Menyimpulkan isi teks disebut ...',
                options: ['membaca', 'menulis', 'kesimpulan', 'judul'],
                answer: 2,
                teksBacaan: 'Setelah membaca, kita perlu menyimpulkan isi teks. Kesimpulan adalah ringkasan makna utama dari teks yang dibaca.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'menulis',
    title: 'Menulis',
    icon: 'PenLine',
    color: 'blue',
    levels: [
      {
        level: 1,
        title: 'Menulis Huruf',
        chapters: [
          {
            id: 'w1l1c1',
            title: 'Menulis Huruf A',
            type: 'menulis',
            writing: [
              { targetText: 'A', targetPattern: 'A', hint: 'Tulis huruf A besar di dalam kanvas' },
              { targetText: 'a', targetPattern: 'a', hint: 'Tulis huruf a kecil di dalam kanvas' },
              { targetText: 'B', targetPattern: 'B', hint: 'Tulis huruf B besar di dalam kanvas' },
            ],
          },
          {
            id: 'w1l1c2',
            title: 'Menulis Huruf Lainnya',
            type: 'menulis',
            writing: [
              { targetText: 'C', targetPattern: 'C', hint: 'Tulis huruf C besar' },
              { targetText: 'D', targetPattern: 'D', hint: 'Tulis huruf D besar' },
              { targetText: 'E', targetPattern: 'E', hint: 'Tulis huruf E besar' },
            ],
          },
        ],
      },
      {
        level: 2,
        title: 'Menulis Kata',
        chapters: [
          {
            id: 'w1l2c1',
            title: 'Menulis Kata Sederhana',
            type: 'menulis',
            writing: [
              { targetText: 'mama', targetPattern: 'mama', hint: 'Tulis kata "mama"' },
              { targetText: 'buku', targetPattern: 'buku', hint: 'Tulis kata "buku"' },
              { targetText: 'susu', targetPattern: 'susu', hint: 'Tulis kata "susu"' },
            ],
          },
        ],
      },
      {
        level: 3,
        title: 'Menulis Kalimat',
        chapters: [
          {
            id: 'w1l3c1',
            title: 'Menulis Kalimat Pendek',
            type: 'menulis',
            writing: [
              { targetText: 'Budi makan.', targetPattern: 'Budi makan.', hint: 'Tulis kalimat di atas kanvas' },
              { targetText: 'Adik lari.', targetPattern: 'Adik lari.', hint: 'Tulis kalimat di atas kanvas' },
            ],
          },
        ],
      },
      {
        level: 4,
        title: 'Menulis Paragraf Pendek',
        chapters: [
          {
            id: 'w1l4c1',
            title: 'Menyusun Paragraf',
            type: 'menulis',
            writing: [
              { targetText: 'Ibu masak nasi.', targetPattern: 'Ibu masak nasi.', hint: 'Tulis kalimat di atas kanvas' },
            ],
          },
        ],
      },
      {
        level: 5,
        title: 'Menulis Karangan',
        chapters: [
          {
            id: 'w1l5c1',
            title: 'Menyusun Cerita',
            type: 'menulis',
            writing: [
              { targetText: 'Pagi cerah.', targetPattern: 'Pagi cerah.', hint: 'Tulis kalimat di atas kanvas' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'berhitung',
    title: 'Berhitung',
    icon: 'Calculator',
    color: 'amber',
    levels: [
      {
        level: 1,
        title: 'Mengenal Angka 1-10',
        chapters: [
          {
            id: 'c1l1c1',
            title: 'Hitung Benda',
            questions: [
              {
                q: 'Berapa jumlah apel di bawah ini?',
                options: ['2', '3', '4', '5'],
                answer: 1,
                ilustrasi: '🍎 🍎 🍎',
                penjelasan: 'Ada 3 apel, jadi jawabannya 3.',
              },
              {
                q: 'Berapa jumlah bola di bawah ini?',
                options: ['4', '5', '6', '7'],
                answer: 1,
                ilustrasi: '⚽ ⚽ ⚽ ⚽ ⚽',
                penjelasan: 'Ada 5 bola, jadi jawabannya 5.',
              },
              {
                q: 'Angka setelah 3 adalah ...',
                options: ['2', '4', '5', '6'],
                answer: 1,
                ilustrasi: '1️⃣ 2️⃣ 3️⃣ ?',
                penjelasan: 'Urutan angka: 1, 2, 3, 4. Setelah 3 adalah 4.',
              },
              {
                q: 'Angka sebelum 7 adalah ...',
                options: ['6', '8', '5', '9'],
                answer: 0,
                ilustrasi: '? 7️⃣ 8️⃣ 9️⃣',
                penjelasan: 'Urutan angka: 6, 7, 8, 9. Sebelum 7 adalah 6.',
              },
            ],
          },
        ],
      },
      {
        level: 2,
        title: 'Penjumlahan & Pengurangan Dasar',
        chapters: [
          {
            id: 'c1l2c1',
            title: 'Penjumlahan dengan Gambar',
            questions: [
              {
                q: 'Berapa jumlah apel semuanya?',
                options: ['4', '5', '6', '7'],
                answer: 1,
                ilustrasi: '🍎 🍎  +  🍎 🍎 🍎',
                penjelasan: '2 + 3 = 5. Jumlahkan semua apel.',
              },
              {
                q: 'Berapa jumlah bola semuanya?',
                options: ['4', '5', '6', '3'],
                answer: 1,
                ilustrasi: '⚽  +  ⚽ ⚽ ⚽ ⚽',
                penjelasan: '1 + 4 = 5. Jumlahkan semua bola.',
              },
              {
                q: 'Berapa jumlah jeruk semuanya?',
                options: ['5', '6', '7', '8'],
                answer: 1,
                ilustrasi: '🍊 🍊 🍊  +  🍊 🍊 🍊',
                penjelasan: '3 + 3 = 6. Jumlahkan semua jeruk.',
              },
              {
                q: 'Berapa jumlah permen semuanya?',
                options: ['6', '7', '8', '9'],
                answer: 1,
                ilustrasi: '🍬 🍬 🍬 🍬 🍬  +  🍬 🍬',
                penjelasan: '5 + 2 = 7. Jumlahkan semua permen.',
              },
            ],
          },
          {
            id: 'c1l2c2',
            title: 'Pengurangan dengan Gambar',
            questions: [
              {
                q: 'Ada 5 apel, 2 dimakan. Sisa berapa?',
                options: ['2', '3', '4', '5'],
                answer: 1,
                ilustrasi: '🍎 🍎 🍎 🍎 🍎  →  🍎 🍎',
                penjelasan: '5 - 2 = 3. Lima apel dikurangi dua yang dimakan, sisa 3.',
              },
              {
                q: 'Ada 7 bola, 3 hilang. Sisa berapa?',
                options: ['3', '4', '5', '6'],
                answer: 1,
                ilustrasi: '⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽  →  ⚽ ⚽ ⚽',
                penjelasan: '7 - 3 = 4. Tujuh bola dikurangi tiga yang hilang, sisa 4.',
              },
              {
                q: 'Ada 10 jeruk, 5 diberikan. Sisa berapa?',
                options: ['4', '5', '6', '7'],
                answer: 1,
                ilustrasi: '🍊x10  →  🍊x5',
                penjelasan: '10 - 5 = 5. Sepuluh jeruk dikurangi lima, sisa 5.',
              },
              {
                q: 'Ada 8 permen, 1 dimakan. Sisa berapa?',
                options: ['6', '7', '8', '9'],
                answer: 1,
                ilustrasi: '🍬x8  →  🍬x1',
                penjelasan: '8 - 1 = 7. Delapan permen dikurangi satu, sisa 7.',
              },
            ],
          },
        ],
      },
      {
        level: 3,
        title: 'Operasi Bilangan Puluhan',
        chapters: [
          {
            id: 'c1l3c1',
            title: 'Penjumlahan Puluhan',
            questions: [
              {
                q: 'Ibu punya 10 permen, lalu membeli 5 lagi di toko. Berapa jumlah permen Ibu sekarang?',
                options: ['12', '15', '20', '25'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '10 + 5 = 15. Ibu punya 10 permen lalu beli 5, jadi 15.',
              },
              {
                q: 'Toko menjual 20 bola kemarin, hari ini masuk 10 bola lagi. Berapa total bola di toko?',
                options: ['25', '30', '35', '40'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '20 + 10 = 30. Toko menjual 20, masuk 10, total 30.',
              },
              {
                q: '15 ekor ayam di kandang A, datang 12 ayam lagi. Berapa total ayam?',
                options: ['25', '27', '30', '17'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '15 + 12 = 27. Lima belas ekor ditambah dua belas, jadi 27.',
              },
              {
                q: 'Andi punya 23 kelereng, Budi memberi 14 kelereng. Berapa total kelereng Andi?',
                options: ['35', '37', '33', '27'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '23 + 14 = 37. Dua puluh tiga ditambah empat belas, jadi 37.',
              },
            ],
          },
        ],
      },
      {
        level: 4,
        title: 'Perkalian & Pembagian',
        chapters: [
          {
            id: 'c1l4c1',
            title: 'Perkalian',
            questions: [
              {
                q: '2 x 3 = ?',
                options: ['5', '6', '7', '8'],
                answer: 1,
                ilustrasi: '🍎🍎  🍎🍎  🍎🍎',
                penjelasan: '2 + 2 + 2 = 6. Dua dikali tiga sama dengan enam.',
              },
              {
                q: '4 x 2 = ?',
                options: ['6', '7', '8', '9'],
                answer: 2,
                ilustrasi: '⚽⚽⚽⚽  ⚽⚽⚽⚽',
                penjelasan: '4 + 4 = 8. Empat dikali dua sama dengan delapan.',
              },
              {
                q: '5 x 3 = ?',
                options: ['10', '12', '15', '18'],
                answer: 2,
                gayaSoal: 'soal_cerita',
                penjelasan: '5 + 5 + 5 = 15. Lima dikali tiga sama dengan lima belas.',
              },
              {
                q: '6 x 4 = ?',
                options: ['20', '22', '24', '26'],
                answer: 2,
                gayaSoal: 'soal_cerita',
                penjelasan: '6 + 6 + 6 + 6 = 24. Enam dikali empat sama dengan dua puluh empat.',
              },
            ],
          },
          {
            id: 'c1l4c2',
            title: 'Pembagian',
            questions: [
              {
                q: '6 : 2 = ?',
                options: ['2', '3', '4', '5'],
                answer: 1,
                ilustrasi: '🍎🍎🍎 | 🍎🍎🍎',
                penjelasan: '6 dibagi 2 = 3. Enam apel dibagi ke 2 kelompok, tiap kelompok 3.',
              },
              {
                q: '10 : 5 = ?',
                options: ['1', '2', '3', '5'],
                answer: 1,
                ilustrasi: '⚽⚽ | ⚽⚽ | ⚽⚽ | ⚽⚽ | ⚽⚽',
                penjelasan: '10 dibagi 5 = 2. Sepuluh bola dibagi ke 5 kelompok, tiap kelompok 2.',
              },
              {
                q: '12 : 3 = ?',
                options: ['3', '4', '5', '6'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '12 dibagi 3 = 4. Dua belas dibagi tiga sama dengan empat.',
              },
              {
                q: '20 : 4 = ?',
                options: ['4', '5', '6', '10'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '20 dibagi 4 = 5. Dua puluh dibagi empat sama dengan lima.',
              },
            ],
          },
        ],
      },
      {
        level: 5,
        title: 'Soal Cerita & Operasi Campuran',
        chapters: [
          {
            id: 'c1l5c1',
            title: 'Soal Cerita',
            questions: [
              {
                q: 'Ibu beli 3 kg gula seharga 10.000/kg. Total bayar berapa?',
                options: ['20.000', '30.000', '13.000', '10.000'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '3 x 10.000 = 30.000. Tiga kilo dikali sepuluh ribu per kilo.',
              },
              {
                q: 'Andi punya 20 kelereng, dikasih 8 ke adik. Sisa berapa?',
                options: ['10', '12', '14', '8'],
                answer: 1,
                gayaSoal: 'soal_cerita',
                penjelasan: '20 - 8 = 12. Dua puluh kelereng dikurangi delapan, sisa dua belas.',
              },
              {
                q: '5 anak masing-masing dapat 3 permen. Total berapa permen?',
                options: ['10', '13', '15', '20'],
                answer: 2,
                gayaSoal: 'soal_cerita',
                penjelasan: '5 x 3 = 15. Lima anak dikali tiga permen, total lima belas.',
              },
            ],
          },
        ],
      },
    ],
  },
];

export function findChapterById(id: string): { module: Module; chapter: import('./types').Chapter } | null {
  for (const m of CURRICULUM) {
    for (const lv of m.levels) {
      const ch = lv.chapters.find((c) => c.id === id);
      if (ch) return { module: m, chapter: ch };
    }
  }
  return null;
}
