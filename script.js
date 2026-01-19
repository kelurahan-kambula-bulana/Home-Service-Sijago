// ==================== KONFIGURASI WHATSAPP ADMIN ====================
const WHATSAPP_ADMIN = {
    number: '082397013485', // Ganti dengan nomor admin sebenarnya
    name: 'Admin SiJago',
    defaultMessage: 'Halo Admin SiJago, saya ingin memesan layanan service'
};

// ==================== KONFIGURASI EMAIL ====================
const EMAIL_CONFIG = {
    serviceId: 'service_6k0sz17', // Ganti dengan Service ID dari EmailJS
    templateId: 'template_ce052j4', // Ganti dengan Template ID dari EmailJS
    userId: 'e30NMLkBfbdBPTxBA', // Ganti dengan User ID dari EmailJS
    adminEmail: 'safriatioppo@gmail.com' // Email admin untuk menerima keluhan
};

// ==================== KONFIGURASI GOOGLE MAPS ====================
const MAPS_CONFIG = {
    // Koordinat untuk Kota Bau-Bau (pusat kota)
    latitude: -5.4693985,
    longitude: 122.5880005,
    
    // Alamat lengkap untuk rute
    address: 'Kota Bau-Bau, Sulawesi Tenggara, Indonesia',
    
    // Link Google Maps untuk berbagai keperluan
    links: {
        // Link untuk embed (iframe)
        embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2031265.4980121158!2d120.68363684999999!3d-4.83715355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2da4c24e7d4f3b4d%3A0xcf72c8c6783e678!2sKota%20Bau-Bau%2C%20Sulawesi%20Tenggara!5e0!3m2!1sid!2sid!4v1705798400000!5m2!1sid!2sid',
        
        // Link untuk membuka Google Maps di tab baru
        direct: 'https://goo.gl/maps/ABC123XYZ456', // Ganti dengan link pendek jika ada
        
        // Link untuk mencari rute dari lokasi pengguna
        directions: 'https://www.google.com/maps/dir//Kota+Bau-Bau,+Sulawesi+Tenggara'
    }
};

// ==================== FUNGSI GOOGLE MAPS ====================

// Fungsi untuk membuka Google Maps di tab baru
function bukaGoogleMaps() {
    // Jika ada link pendek, gunakan itu, jika tidak buat link dari koordinat
    const mapsUrl = MAPS_CONFIG.links.direct || 
                   `https://www.google.com/maps?q=${MAPS_CONFIG.latitude},${MAPS_CONFIG.longitude}`;
    
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    
    // Simpan riwayat klik ke localStorage
    saveMapsHistory('direct');
}

// Fungsi untuk membuka Google Maps dengan fitur "Dapatkan Rute"
function bukaGoogleMapsRoute() {
    // Tanyakan apakah ingin menggunakan lokasi saat ini
    if (confirm('Gunakan lokasi Anda saat ini sebagai titik awal?')) {
        // Jika pengguna mengizinkan, gunakan geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/Kota+Bau-Bau,+Sulawesi+Tenggara`;
                    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
                    saveMapsHistory('directions_with_location');
                },
                function(error) {
                    console.error('Error getting location:', error);
                    // Fallback ke rute tanpa lokasi pengguna
                    window.open(MAPS_CONFIG.links.directions, '_blank', 'noopener,noreferrer');
                    saveMapsHistory('directions_without_location');
                }
            );
        } else {
            // Browser tidak mendukung geolocation
            window.open(MAPS_CONFIG.links.directions, '_blank', 'noopener,noreferrer');
            saveMapsHistory('directions_without_location');
        }
    } else {
        // Pengguna memilih untuk tidak menggunakan lokasi saat ini
        window.open(MAPS_CONFIG.links.directions, '_blank', 'noopener,noreferrer');
        saveMapsHistory('directions_without_location');
    }
}

// Fungsi untuk menyimpan riwayat penggunaan Google Maps
function saveMapsHistory(action) {
    const mapsHistory = {
        timestamp: new Date().toISOString(),
        action: action,
        location: MAPS_CONFIG.address
    };
    
    // Simpan ke localStorage
    const history = JSON.parse(localStorage.getItem('sijago_maps_history') || '[]');
    history.push(mapsHistory);
    localStorage.setItem('sijago_maps_history', JSON.stringify(history.slice(-5))); // Simpan 5 riwayat terakhir
}

// ==================== FUNGSI WHATSAPP ====================

// Fungsi untuk membuka WhatsApp dengan nomor admin
function openWhatsApp(customMessage = null) {
    const message = customMessage || WHATSAPP_ADMIN.defaultMessage;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_ADMIN.number}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Simpan riwayat chat
    saveChatHistory(message);
}

// Fungsi untuk menyalin nomor admin ke clipboard
function salinNomor() {
    const nomor = WHATSAPP_ADMIN.number;
    
    // Format nomor untuk ditampilkan
    const formattedNumber = formatPhoneNumber(nomor);
    
    navigator.clipboard.writeText(nomor).then(() => {
        alert(`Nomor WhatsApp admin berhasil disalin: ${formattedNumber}\n\nAnda dapat menambahkan nomor ini ke kontak WhatsApp Anda.`);
        
        // Tampilkan instruksi untuk menambahkan kontak
        showContactInstructions();
    }).catch(err => {
        console.error('Gagal menyalin nomor:', err);
        // Fallback untuk browser lama
        const textArea = document.createElement('textarea');
        textArea.value = nomor;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`Nomor WhatsApp admin berhasil disalin: ${formattedNumber}`);
    });
}

// Fungsi untuk menyalin email admin ke clipboard
function salinEmail() {
    const email = EMAIL_CONFIG.adminEmail;
    
    navigator.clipboard.writeText(email).then(() => {
        alert(`Email admin berhasil disalin: ${email}`);
    }).catch(err => {
        console.error('Gagal menyalin email:', err);
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`Email admin berhasil disalin: ${email}`);
    });
}

// Fungsi untuk menambah kontak ke daftar kontak pengguna
function tambahKontak() {
    // Format vCard untuk menambah kontak
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${WHATSAPP_ADMIN.name}
TEL;TYPE=CELL,VOICE:${WHATSAPP_ADMIN.number}
ORG:SiJago - Layanan Service
TITLE:Admin Customer Service
NOTE:Hubungi untuk layanan service AC, Kulkas, TV, Mesin Cuci
URL:https://wa.me/${WHATSAPP_ADMIN.number}
END:VCARD`;

    // Buat blob dari vCard data
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Buat elemen link untuk download
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kontak_${WHATSAPP_ADMIN.name}.vcf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Tampilkan instruksi
    alert(`Kontak ${WHATSAPP_ADMIN.name} berhasil diunduh.\n\nLangkah menambahkan ke kontak:\n1. Buka file yang diunduh\n2. Pilih "Tambahkan ke Kontak"\n3. Simpan kontak\n\nSetelah itu, Anda dapat membalas chat langsung dari WhatsApp.`);
}

// Fungsi untuk generate QR Code
function generateQRCode() {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/${WHATSAPP_ADMIN.number}`;
    
    // Tampilkan QR Code
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');
    if (qrCodeDisplay) {
        qrCodeDisplay.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code WhatsApp Admin" style="width: 150px; height: 150px;">`;
    }
}

// Fungsi untuk mendownload QR Code
function downloadQRCode() {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://wa.me/${WHATSAPP_ADMIN.number}`;
    
    // Buat link download
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR-Code-WhatsApp-${WHATSAPP_ADMIN.name}.png`;
    link.click();
}

// Fungsi untuk menampilkan instruksi kontak
function showContactInstructions() {
    const instructions = `
Cara menambahkan nomor admin ke kontak WhatsApp:

1. Buka aplikasi WhatsApp
2. Tap ikon "Chat Baru" (pensil/icon +)
3. Tap "Kontak Baru"
4. Masukkan nama: ${WHATSAPP_ADMIN.name}
5. Masukkan nomor: ${WHATSAPP_ADMIN.number}
6. Tap "Simpan"

Setelah itu, Anda dapat:
- Membalas chat dari admin
- Mengirim pesan kapan saja
- Melihat status admin
- Melakukan panggilan jika diperlukan
`;
    
    if (confirm("Tampilkan instruksi lengkap untuk menambahkan ke kontak?")) {
        alert(instructions);
    }
}

// Fungsi untuk memformat nomor telepon
function formatPhoneNumber(phoneNumber) {
    // Format: +62 82397013485
    const cleaned = phoneNumber.toString().replace(/\D/g, '');
    if (cleaned.startsWith('62')) {
        return `+${cleaned.substring(0,2)} ${cleaned.substring(2,5)}-${cleaned.substring(5,9)}-${cleaned.substring(9)}`;
    } else if (cleaned.startsWith('0')) {
        return `+62 ${cleaned.substring(1,4)}-${cleaned.substring(4,8)}-${cleaned.substring(8)}`;
    }
    return phoneNumber;
}

// Fungsi untuk menyimpan riwayat chat
function saveChatHistory(message) {
    const chatHistory = {
        timestamp: new Date().toISOString(),
        message: message,
        adminNumber: WHATSAPP_ADMIN.number
    };
    
    // Simpan ke localStorage
    const history = JSON.parse(localStorage.getItem('sijago_chat_history') || '[]');
    history.push(chatHistory);
    localStorage.setItem('sijago_chat_history', JSON.stringify(history.slice(-10))); // Simpan 10 chat terakhir
}

// ==================== FUNGSI FORM KELUHAN (EMAIL) ====================

// Fungsi untuk mengirim form keluhan via EmailJS
function submitKeluhanForm(event) {
    event.preventDefault();
    
    // Mengambil nilai dari form
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const telepon = document.getElementById('telepon').value;
    const jenisLayanan = document.getElementById('jenisLayanan').value;
    const keluhan = document.getElementById('keluhan').value;
    
    // Validasi form
    if (!nama || !email || !telepon || !jenisLayanan || !keluhan) {
        alert('Harap lengkapi semua field sebelum mengirim!');
        return false;
    }
    
    // Validasi email
    if (!validateEmail(email)) {
        alert('Harap masukkan alamat email yang valid!');
        return false;
    }
    
    // Tampilkan status loading
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Mengirim...';
    submitBtn.disabled = true;
    
    // Sembunyikan pesan status sebelumnya
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    
    // Kirim email menggunakan EmailJS
    sendEmailViaEmailJS(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText);
    
    return false;
}

// Fungsi untuk mengirim email menggunakan EmailJS
function sendEmailViaEmailJS(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText) {
    // Jika EmailJS sudah diatur, gunakan EmailJS
    if (EMAIL_CONFIG.userId !== 'user_XXXXXXXXXXXXXX') {
        // Muat library EmailJS jika belum dimuat
        if (typeof emailjs === 'undefined') {
            loadEmailJS().then(() => {
                sendEmailWithEmailJS(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText);
            }).catch(error => {
                console.error('Gagal memuat EmailJS:', error);
                sendEmailFallback(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText);
            });
        } else {
            sendEmailWithEmailJS(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText);
        }
    } else {
        // Fallback jika EmailJS tidak diatur
        sendEmailFallback(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText);
    }
}

// Fungsi untuk memuat library EmailJS
function loadEmailJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            // Initialize EmailJS
            emailjs.init(EMAIL_CONFIG.userId);
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Fungsi untuk mengirim email dengan EmailJS
function sendEmailWithEmailJS(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText) {
    const templateParams = {
        from_name: nama,
        from_email: email,
        phone: telepon,
        service_type: jenisLayanan,
        message: keluhan,
        to_email: EMAIL_CONFIG.adminEmail,
        date: new Date().toLocaleDateString('id-ID')
    };
    
    emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
        .then(function(response) {
            console.log('Email berhasil dikirim:', response);
            
            // Reset form
            document.getElementById('keluhanForm').reset();
            
            // Tampilkan pesan sukses
            document.getElementById('emailStatus').style.display = 'block';
            document.getElementById('successMessage').style.display = 'block';
            
            // Scroll ke pesan sukses
            document.getElementById('emailStatus').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Simpan ke localStorage
            saveComplaintHistory(nama, email, telepon, jenisLayanan, keluhan);
            
            // Kembalikan tombol ke keadaan semula setelah 3 detik
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }, function(error) {
            console.error('Gagal mengirim email:', error);
            
            // Tampilkan pesan error
            document.getElementById('emailStatus').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'block';
            
            // Kembalikan tombol ke keadaan semula
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Tawarkan opsi fallback
            if (confirm('Gagal mengirim keluhan via email. Ingin mengirim melalui WhatsApp sebagai alternatif?')) {
                const whatsappMessage = `📋 KELUHAN SIJAGO (Alternatif WhatsApp)\n\nNama: ${nama}\nEmail: ${email}\nTelepon: ${telepon}\nLayanan: ${jenisLayanan}\n\nKeluhan:\n${keluhan}`;
                openWhatsApp(whatsappMessage);
            }
        });
}

// Fallback jika EmailJS tidak tersedia
function sendEmailFallback(nama, email, telepon, jenisLayanan, keluhan, submitBtn, originalText) {
    // Membuat link mailto sebagai fallback
    const subject = `Keluhan Layanan SiJago - ${nama}`;
    const body = `
Keluhan Layanan SiJago

Nama: ${nama}
Email: ${email}
Telepon: ${telepon}
Jenis Layanan: ${jenisLayanan}

Isi Keluhan:
${keluhan}

Tanggal: ${new Date().toLocaleDateString('id-ID')}
`;
    
    const mailtoLink = `mailto:${EMAIL_CONFIG.adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Buka client email default
    window.open(mailtoLink, '_blank');
    
    // Reset form
    document.getElementById('keluhanForm').reset();
    
    // Tampilkan pesan sukses
    document.getElementById('emailStatus').style.display = 'block';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('successMessage').innerHTML = '<i class="bi bi-check-circle"></i> Keluhan siap dikirim! Client email Anda akan terbuka. Silakan kirim email tersebut.';
    
    // Simpan ke localStorage
    saveComplaintHistory(nama, email, telepon, jenisLayanan, keluhan);
    
    // Kembalikan tombol ke keadaan semula
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
}

// Fungsi untuk validasi email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Fungsi untuk menyimpan riwayat keluhan
function saveComplaintHistory(nama, email, telepon, jenisLayanan, keluhan) {
    const complaintHistory = {
        timestamp: new Date().toISOString(),
        nama: nama,
        email: email,
        telepon: telepon,
        jenisLayanan: jenisLayanan,
        keluhan: keluhan.substring(0, 100) + (keluhan.length > 100 ? '...' : '')
    };
    
    // Simpan ke localStorage
    const history = JSON.parse(localStorage.getItem('sijago_complaint_history') || '[]');
    history.push(complaintHistory);
    localStorage.setItem('sijago_complaint_history', JSON.stringify(history.slice(-5))); // Simpan 5 keluhan terakhir
}

// ==================== DATA & FUNGSI LAMA ====================

// Data daftar harga untuk setiap jenis layanan
const hargaData = {
    kulkas: {
        title: "Kulkas",
        items: [
            {
                tingkat: "Kerusakan Rendah",
                waktu: "1-3 Jam",
                harga: "Rp.150.000 - Rp.500.000"
            },
            {
                tingkat: "Kerusakan Sedang",
                waktu: "2-6 Jam",
                harga: "Rp.500.000 - Rp.1.500.000"
            },
            {
                tingkat: "Kerusakan Tinggi",
                waktu: "1-3 Hari",
                harga: "Rp.1.500.000 - Rp.3.500.000"
            }
        ]
    },
    ac: {
        title: "AC",
        items: [
            {
                tingkat: "Kerusakan Rendah",
                waktu: "1-2 Jam",
                harga: "Rp.150.000 - Rp.400.000"
            },
            {
                tingkat: "Kerusakan Sedang",
                waktu: "2-6 Jam",
                harga: "Rp.400.000 - Rp.1.500.000"
            },
            {
                tingkat: "Kerusakan Tinggi",
                waktu: "4 Jam - 2 Hari",
                harga: "Rp.1.500.000 - Rp.4.000.000"
            }
        ]
    },
    televisi: {
        title: "Televisi",
        items: [
            {
                tingkat: "Kerusakan Rendah",
                waktu: "30 menit - 2 Jam",
                harga: "Rp.100.000 - Rp.400.000"
            },
            {
                tingkat: "Kerusakan Sedang",
                waktu: "2-6 Jam",
                harga: "Rp.500.000 - Rp.1.500.000"
            },
            {
                tingkat: "Kerusakan Tinggi",
                waktu: "1-3 Hari",
                harga: "Rp.1.500.000 - Rp.3.500.000"
            }
        ]
    },
    "mesin-cuci": {
        title: "Mesin Cuci",
        items: [
            {
                tingkat: "Kerusakan Rendah",
                waktu: "1-2 Jam",
                harga: "Rp.80.000 - Rp.500.000"
            },
            {
                tingkat: "Kerusakan Sedang",
                waktu: "2-4 Jam",
                harga: "Rp.150.000 - Rp.400.000"
            },
            {
                tingkat: "Kerusakan Tinggi",
                waktu: "4 Jam - 1 Hari",
                harga: "Rp.300.000 - Rp.600.000"
            }
        ]
    }
};

// Fungsi untuk menampilkan modal dengan harga
function showHargaModal(jenis) {
    const data = hargaData[jenis];
    if (!data) return;
    
    // Membuat konten modal
    let modalContent = `
        <div class="harga-item">
            <h4>${data.title}</h4>
    `;
    
    data.items.forEach(item => {
        modalContent += `
            <div class="kerusakan-item">
                <div class="kerusakan-title">${item.tingkat}</div>
                <div class="kerusakan-detail">
                    <span class="kerusakan-waktu">${item.waktu}</span>
                    <span class="kerusakan-harga">${item.harga}</span>
                </div>
            </div>
        `;
    });
    
    modalContent += `</div>`;
    
    // Menampilkan konten di modal
    document.getElementById('hargaModalBody').innerHTML = modalContent;
    
    // Menampilkan modal
    const modal = new bootstrap.Modal(document.getElementById('hargaModal'));
    modal.show();
}

// Fungsi untuk auto-scroll horizontal
function initAutoScroll() {
    const scrollContainers = document.querySelectorAll('.horizontal-scroll-container');
    
    scrollContainers.forEach(container => {
        let scrollPosition = 0;
        const scrollStep = 1;
        const scrollSpeed = 30; // ms
        
        // Fungsi untuk melakukan auto-scroll
        function autoScroll() {
            // Reset scroll position jika sudah mencapai akhir
            if (scrollPosition >= container.scrollWidth - container.clientWidth) {
                scrollPosition = 0;
            } else {
                scrollPosition += scrollStep;
            }
            
            container.scrollLeft = scrollPosition;
        }
        
        // Mulai auto-scroll
        let scrollInterval = setInterval(autoScroll, scrollSpeed);
        
        // Hentikan auto-scroll saat hover
        container.addEventListener('mouseenter', () => {
            clearInterval(scrollInterval);
        });
        
        // Lanjutkan auto-scroll saat mouse keluar
        container.addEventListener('mouseleave', () => {
            scrollInterval = setInterval(autoScroll, scrollSpeed);
        });
    });
}

// Fungsi untuk smooth scroll ke section
function initSmoothScroll() {
    // Menambahkan event listener untuk semua link navigasi
    document.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Menutup navbar mobile jika terbuka
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const navbarToggler = document.querySelector('.navbar-toggler');
                        navbarToggler.click();
                    }
                    
                    // Scroll ke section dengan smooth behavior
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Fungsi untuk menambahkan animasi saat scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, observerOptions);
    
    // Menambahkan animasi ke elemen yang diinginkan
    document.querySelectorAll('.layanan-card, .prosedur-item, .fitur-card, .info-card, .keluhan-card').forEach(card => {
        observer.observe(card);
    });
}

// ==================== INISIALISASI ====================

// Update semua kontak yang ada
function updateContactInfo() {
    // Update nomor WhatsApp yang ditampilkan
    document.querySelectorAll('#nomorAdmin').forEach(el => {
        if (el) el.textContent = formatPhoneNumber(WHATSAPP_ADMIN.number);
    });
    
    // Update email admin yang ditampilkan
    document.querySelectorAll('#emailAdmin').forEach(el => {
        if (el) el.textContent = EMAIL_CONFIG.adminEmail;
    });
    
    // Update footer
    const footerPhone = document.getElementById('footerPhone');
    if (footerPhone) {
        footerPhone.textContent = formatPhoneNumber(WHATSAPP_ADMIN.number).replace('+', '');
    }
    
    const footerEmail = document.getElementById('footerEmail');
    if (footerEmail) {
        footerEmail.textContent = EMAIL_CONFIG.adminEmail;
    }
    
    // Update tombol WhatsApp di footer
    const footerWhatsapp = document.querySelector('.footer .whatsapp');
    if (footerWhatsapp) {
        footerWhatsapp.href = `javascript:void(0);`;
        footerWhatsapp.setAttribute('onclick', `openWhatsApp('Halo SiJago, saya ingin follow media sosial Anda')`);
    }
}

// Fungsi untuk inisialisasi semua event
function initEvents() {
    // Event listener untuk item prosedur
    document.querySelectorAll('.prosedur-item').forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showHargaModal(target);
        });
    });
    
    // Event listener untuk form keluhan
    const formKeluhan = document.getElementById('keluhanForm');
    if (formKeluhan) {
        // Remove any existing event listeners and add new one
        formKeluhan.onsubmit = null;
        formKeluhan.addEventListener('submit', function(e) {
            e.preventDefault();
            submitKeluhanForm(e);
        });
    }
    
    // Event listener untuk tombol WhatsApp di carousel
    document.querySelectorAll('.btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp('Saya tertarik dengan layanan SiJago, bisa informasi lebih lanjut?');
        });
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi semua fungsi lama
    initAutoScroll();
    initSmoothScroll();
    initScrollAnimations();
    initEvents();
    
    // Update semua informasi kontak
    updateContactInfo();
    
    // Generate QR Code
    generateQRCode();
    
    // Inisialisasi carousel dengan interval
    const carousel = new bootstrap.Carousel(document.getElementById('berandaCarousel'), {
        interval: 5000, // Ganti gambar setiap 5 detik
        ride: 'carousel'
    });
    
    // Menambahkan tahun saat ini di footer
    const yearSpan = document.querySelector('.copyright');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = yearSpan.innerHTML.replace('2023', currentYear);
    }
    
    // Instruksi untuk mengatur EmailJS
    console.log('Untuk mengaktifkan pengiriman email via EmailJS:');
    console.log('1. Buat akun di https://www.emailjs.com/');
    console.log('2. Dapatkan Service ID, Template ID, dan User ID');
    console.log('3. Update konfigurasi EMAIL_CONFIG di file script.js');
});

// Fungsi untuk menangani resize window
window.addEventListener('resize', function() {
    // Reset scroll position pada horizontal scroll containers
    document.querySelectorAll('.horizontal-scroll-container').forEach(container => {
        container.scrollLeft = 0;
    });
});