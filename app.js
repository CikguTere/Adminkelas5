// firebase-imports.js (These imports would ideally be in a separate file too for true modularity,
// but for the sake of single app.js, they are kept here).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Variabel global yang disediakan oleh lingkungan Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase instances and functions to global scope (for direct use by event handlers in HTML)
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAuth = auth;
window.signInAnonymously = signInAnonymously;
window.signInWithCustomToken = signInWithCustomToken;
window.onAuthStateChanged = onAuthStateChanged;
window.getFirestore = getFirestore;
window.doc = doc;
window.getDoc = getDoc;
window.addDoc = addDoc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.onSnapshot = onSnapshot;
window.collection = collection;
window.query = query;
window.where = where;
window.getDocs = getDocs;
window.orderBy = orderBy;
window.appId = appId;
window.initialAuthToken = initialAuthToken;


window.addEventListener('load', async () => {
    // Inisialisasi ikon Lucide
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } else {
        console.warn("Lucide library not found or createIcons not available.");
    }


    // --- Data Mock Awal (akan digunakan jika Firestore kosong atau untuk inisialisasi pertama) ---
    // Struktur data mock tetap sama
    let initialStudentData = [
        { id: '1', nisn: '0051234567', name: 'Budi Santoso', gender: 'Laki-laki', birthPlace: 'Jakarta', birthDate: '2013-05-10', parent: 'Ahmad Santoso', address: 'Jl. Merdeka No. 1' },
        { id: '2', nisn: '0051234568', name: 'Citra Lestari', gender: 'Perempuan', birthPlace: 'Bandung', birthDate: '2013-08-15', parent: 'Dewi Lestari', address: 'Jl. Pahlawan No. 22' },
        { id: '3', nisn: '0051234569', name: 'Eka Wijaya', gender: 'Laki-laki', birthPlace: 'Surabaya', birthDate: '2014-01-20', parent: 'Joko Wijaya', address: 'Jl. Kenanga No. 5' },
        { id: '4', nisn: '0051234570', name: 'Fani Indah', gender: 'Perempuan', birthPlace: 'Bogor', birthDate: '2013-03-25', parent: 'Siti Aminah', address: 'Jl. Mawar No. 10' },
        { id: '5', nisn: '0051234571', name: 'Gilang Ramadhan', gender: 'Laki-laki', birthPlace: 'Semarang', birthDate: '2014-07-01', parent: 'Wahyu Nugroho', address: 'Jl. Anggrek No. 15' },
    ];

    let initialSchedule = {
        Senin: [{ id: '1', time: '07:30 - 09:00', subject: 'Matematika' }, { id: '2', time: '09:30 - 11:00', subject: 'Bahasa Indonesia' }],
        Selasa: [{ id: '3', time: '07:30 - 09:00', subject: 'IPA' }, { id: '4', time: '09:30 - 11:00', subject: 'IPS' }],
        Rabu: [{ id: '5', time: '07:30 - 09:00', subject: 'PPKn' }, { id: '6', time: '09:30 - 11:00', subject: 'Seni Budaya' }],
        Kamis: [{ id: '7', time: '07:30 - 09:00', subject: 'Bahasa Inggris' }, { id: '8', time: '09:30 - 11:00', subject: 'PJOK' }],
        Jumat: [{ id: '9', time: '07:30 - 09:00', subject: 'Pramuka' }],
    };

    let initialGuruProfile = {
        name: 'Anisa Pujiastuti, S.Pd.',
        nip: '198508172010012001',
        email: 'anisa.p@guru.sd.belajar.id',
        whatsapp: '081234567890',
        photo: 'https://placehold.co/128x128/E0E7FF/4F46E5?text=Foto'
    };

    let initialDaftarHadir = [
        { id: '1', date: '2025-07-01', studentName: 'Budi Santoso', status: 'Hadir' },
        { id: '2', date: '2025-07-01', studentName: 'Citra Lestari', status: 'Hadir' },
        { id: '3', date: '2025-07-01', studentName: 'Eka Wijaya', status: 'Alpha' },
        { id: '4', date: '2025-07-01', studentName: 'Fani Indah', status: 'Hadir' },
        { id: '5', date: '2025-07-01', studentName: 'Gilang Ramadhan', status: 'Sakit' },
        { id: '6', date: '2025-07-02', studentName: 'Budi Santoso', status: 'Hadir' },
        { id: '7', date: '2025-07-02', studentName: 'Citra Lestari', status: 'Izin' },
        { id: '8', date: '2025-07-02', studentName: 'Eka Wijaya', status: 'Hadir' },
        { id: '9', date: '2025-07-02', studentName: 'Fani Indah', status: 'Hadir' },
        { id: '10', date: '2025-07-02', studentName: 'Gilang Ramadhan', status: 'Hadir' },
        { id: '11', date: '2025-07-03', studentName: 'Budi Santoso', status: 'Hadir' },
        { id: '12', date: '2025-07-03', studentName: 'Citra Lestari', status: 'Hadir' },
        { id: '13', date: '2025-07-03', studentName: 'Eka Wijaya', status: 'Hadir' },
        { id: '14', date: '2025-07-03', studentName: 'Fani Indah', status: 'Alpha' },
        { id: '15', date: '2025-07-03', studentName: 'Gilang Ramadhan', status: 'Sakit' },
        { id: '16', date: '2025-08-01', studentName: 'Budi Santoso', status: 'Hadir' },
        { id: '17', date: '2025-08-01', studentName: 'Citra Lestari', status: 'Hadir' },
        { id: '18', date: '2025-08-01', studentName: 'Eka Wijaya', status: 'Hadir' },
        { id: '19', date: '2025-08-01', studentName: 'Fani Indah', status: 'Hadir' },
        { id: '20', date: '2025-08-01', studentName: 'Gilang Ramadhan', status: 'Hadir' },
    ];

    let initialProgramSemesterTahunan = [
        { id: '1', programName: 'Penyusunan RPP Semester Ganjil', description: 'Menyusun Rencana Pelaksanaan Pembelajaran untuk semester ganjil tahun ajaran 2025/2026.', year: '2025' },
        { id: '2', programName: 'Evaluasi Pembelajaran IPA', description: 'Evaluasi hasil pembelajaran mata pelajaran IPA kelas 5.', year: '2025' },
    ];

    let initialKalenderPendidikan = [
        { id: '1', eventName: 'Libur Idul Adha', date: '2025-06-17', notes: 'Libur Nasional' },
        { id: '2', eventName: 'Penilaian Tengah Semester Ganjil', date: '2025-09-20', notes: 'Meliputi semua mata pelajaran' },
    ];

    let initialAsesmen = [
        { id: '1', assessmentName: 'Ulangan Harian Matematika - Pecahan', date: '2025-07-15', subject: 'Matematika', link: 'https://docs.google.com/forms/d/e/1FAIpQLSc_example_math/viewform' },
        { id: '2', assessmentName: 'Proyek Sains - Ekosistem', date: '2025-08-01', subject: 'IPA', link: 'https://docs.google.com/document/d/1C_example_project/edit' },
        { id: '3', assessmentName: 'Kuis Sejarah - Pahlawan Nasional', date: '2025-08-10', subject: 'IPS', link: 'https://quizizz.com/admin/quiz/61_example_history/start' },
    ];

    let initialModulAjar = [
        {id: '1', title: 'Modul Matematika - Pecahan', link: 'https://docs.google.com/document/d/1example/edit'},
        {id: '2', title: 'Modul IPA - Ekosistem', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
    ];

    let initialRiwayatPelatihan = [
        {id: '1', topic: 'Kurikulum Merdeka', organizer: 'Dinas Pendidikan', date: '2024-03-10'}
    ];

    let initialDaftarNilai = [
        { id: '1', subjectName: 'Matematika', googleSheetLink: 'https://docs.google.com/spreadsheets/d/1B-z_example_math/edit?usp=sharing' },
        { id: '2', subjectName: 'Bahasa Indonesia', googleSheetLink: 'https://docs.google.com/spreadsheets/d/1A-y_example_indo/edit?usp=sharing' },
        { id: '3', subjectName: 'IPA', googleSheetLink: 'https://docs.google.com/spreadsheets/d/1C-x_example_ipa/edit?usp=sharing' },
    ];

    // --- Global State ---
    let isLoggedIn = false;
    let activeMenu = 'Dashboard';
    let userId = null;
    // Firebase instances (db, auth) are already initialized in global scope by the module import

    // Data state (will be populated from Firestore)
    let guruProfile = { ...initialGuruProfile }; // Always load immediately
    let studentData = [];
    let schedule = JSON.parse(JSON.stringify(initialSchedule)); // Deep copy for nested objects, will be updated by snapshot
    let daftarHadir = [];
    let programSemesterTahunan = [];
    let kalenderPendidikan = [];
    let daftarNilai = [];
    let asesmen = [];
    let modulAjar = [];
    let riwayatPelatihan = [];

    // Flags to track if data for a module has been fetched/initialized
    let studentsLoaded = false;
    let scheduleLoaded = false;
    let daftarHadirLoaded = false;
    let programSemesterTahunanLoaded = false;
    let kalenderPendidikanLoaded = false;
    let daftarNilaiLoaded = false;
    let asesmenLoaded = false;
    let modulAjarLoaded = false;
    let riwayatPelatihanLoaded = false;


    let messageModal = { isOpen: false, title: '', message: '' };
    let dataModal = { isOpen: false, title: '', formHtml: '' };
    let confirmDeleteModal = { isOpen: false, message: '', onConfirm: null };

    let editingItem = null; // Used for generic edit modal
    let itemToDelete = null; // Used for generic delete confirmation

    let selectedDateDaftarHadir = ''; // State for filtering daftar hadir

    // --- DOM Elements ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const appContainer = document.getElementById('app-container');
    const mainContent = document.getElementById('main-content');
    const guruNameSpan = document.getElementById('guru-name');
    const guruPhotoImg = document.getElementById('guru-photo');
    const logoutButton = document.getElementById('logout-button');
    const loginPage = document.getElementById('login-page');
    const loginButton = document.getElementById('login-button');

    const messageModalElem = document.getElementById('message-modal');
    const messageModalTitleElem = document.getElementById('message-modal-title');
    const messageModalMessageElem = document.getElementById('message-modal-message');
    const messageModalCloseButton = document.getElementById('message-modal-close');
    const messageModalOkButton = document.getElementById('message-modal-ok');

    const dataModalElem = document.getElementById('data-modal');
    const dataModalTitleElem = document.getElementById('data-modal-title');
    const dataModalFormElem = document.getElementById('data-modal-form');
    const dataModalCloseButton = document.getElementById('data-modal-close');
    const dataModalCancelButton = document.getElementById('data-modal-cancel');
    const dataModalSubmitButton = document.getElementById('data-modal-submit');

    const confirmDeleteModalElem = document.getElementById('confirm-delete-modal');
    const confirmDeleteModalMessageElem = document.getElementById('confirm-delete-modal-message');
    const confirmDeleteModalCloseButton = document.getElementById('confirm-delete-modal-close');
    const confirmDeleteModalCancelButton = document.getElementById('confirm-delete-modal-cancel');
    const confirmDeleteModalConfirmButton = document.getElementById('confirm-delete-modal-confirm');


    // Set up Auth state listener
    window.onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
            isLoggedIn = true;
            await fetchGuruProfile(); // Only fetch guru profile on initial auth
        } else {
            // Try to sign in anonymously with custom token if available
            if (initialAuthToken) { // Use the module-scoped initialAuthToken
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                } catch (error) {
                    console.error("Error signing in with custom token:", error);
                    await signInAnonymously(auth); // Fallback to anonymous
                }
            } else {
                await signInAnonymously(auth); // Sign in anonymously
            }
        }
        renderApp(); // Render after auth state is determined and guru profile fetched
    });

    // --- Firestore Helper Functions ---
    function getCollectionRef(collectionName) {
        if (!userId) {
            console.error("User not authenticated. Cannot get collection reference.");
            return null;
        }
        return collection(db, `artifacts/${appId}/users/${userId}/${collectionName}`);
    }

    function getDocRef(collectionName, docId) {
        if (!userId) {
            console.error("User not authenticated. Cannot get document reference.");
            return null;
        }
        return doc(db, `artifacts/${appId}/users/${userId}/${collectionName}`, docId);
    }

    // --- Specific Data Fetching Functions (Lazy Loaded) ---
    async function fetchGuruProfile() {
        loadingOverlay.style.display = 'flex';
        try {
            const guruProfileDoc = await getDoc(getDocRef('profile', 'guruProfileDoc'));
            if (guruProfileDoc.exists()) {
                guruProfile = guruProfileDoc.data();
            } else {
                // Set initial data if not found
                await setDoc(getDocRef('profile', 'guruProfileDoc'), initialGuruProfile);
                guruProfile = initialGuruProfile;
            }
        } catch (error) {
            console.error("Error fetching guru profile:", error);
            showMessage(`Gagal memuat profil guru: ${error.message}. Coba refresh halaman.`, 'Kesalahan Data');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    function initializeStudentsListener() {
        if (studentsLoaded) return;
        studentsLoaded = true;
        onSnapshot(getCollectionRef('students'), (snapshot) => {
            studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (studentData.length === 0) { // If Firestore is empty, use initial mock data
                initialStudentData.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('students')), item);
                });
                studentData = initialStudentData; // Set local state for immediate display
            }
            renderApp(); // Re-render once data is loaded/updated
        });
    }

    function initializeScheduleListener() {
        if (scheduleLoaded) return;
        scheduleLoaded = true;
        onSnapshot(getCollectionRef('schedules'), (snapshot) => {
            const fetchedSchedule = {};
            snapshot.docs.forEach(doc => {
                fetchedSchedule[doc.id] = doc.data().lessons;
            });
            schedule = { ...initialSchedule, ...fetchedSchedule }; // Merge with initial to ensure all days exist
            if (Object.keys(fetchedSchedule).length === 0) { // If Firestore is empty, initialize with mock data
                for (const day in initialSchedule) {
                    setDoc(getDocRef('schedules', day), { lessons: initialSchedule[day] });
                }
                schedule = initialSchedule; // Set local state for immediate display
            }
            renderApp();
        });
    }

    function initializeDaftarHadirListener() {
        if (daftarHadirLoaded) return;
        daftarHadirLoaded = true;
        onSnapshot(getCollectionRef('attendance'), (snapshot) => {
            daftarHadir = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (daftarHadir.length === 0) {
                initialDaftarHadir.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('attendance')), item);
                });
                daftarHadir = initialDaftarHadir;
            }
            renderApp();
        });
    }

    function initializeProgramSemesterTahunanListener() {
        if (programSemesterTahunanLoaded) return;
        programSemesterTahunanLoaded = true;
        onSnapshot(getCollectionRef('semester_programs'), (snapshot) => {
            programSemesterTahunan = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (programSemesterTahunan.length === 0) {
                initialProgramSemesterTahunan.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('semester_programs')), item);
                });
                programSemesterTahunan = initialProgramSemesterTahunan;
            }
            renderApp();
        });
    }

    function initializeKalenderPendidikanListener() {
        if (kalenderPendidikanLoaded) return;
        kalenderPendidikanLoaded = true;
        onSnapshot(getCollectionRef('calendar_events'), (snapshot) => {
            kalenderPendidikan = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (kalenderPendidikan.length === 0) {
                initialKalenderPendidikan.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('calendar_events')), item);
                });
                kalenderPendidikan = initialKalenderPendidikan;
            }
            renderApp();
        });
    }

    function initializeDaftarNilaiListener() {
        if (daftarNilaiLoaded) return;
        daftarNilaiLoaded = true;
        onSnapshot(getCollectionRef('grades'), (snapshot) => {
            daftarNilai = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (daftarNilai.length === 0) {
                initialDaftarNilai.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('grades')), item);
                });
                daftarNilai = initialDaftarNilai;
            }
            renderApp();
        });
    }

    function initializeAsesmenListener() {
        if (asesmenLoaded) return;
        asesmenLoaded = true;
        onSnapshot(getCollectionRef('assessments'), (snapshot) => {
            asesmen = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (asesmen.length === 0) {
                initialAsesmen.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('assessments')), item);
                });
                asesmen = initialAsesmen;
            }
            renderApp();
        });
    }

    function initializeModulAjarListener() {
        if (modulAjarLoaded) return;
        modulAjarLoaded = true;
        onSnapshot(getCollectionRef('teaching_modules'), (snapshot) => {
            modulAjar = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (modulAjar.length === 0) {
                initialModulAjar.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('teaching_modules')), item);
                });
                modulAjar = initialModulAjar;
            }
            renderApp();
        });
    }

    function initializeRiwayatPelatihanListener() {
        if (riwayatPelatihanLoaded) return;
        riwayatPelatihanLoaded = true;
        onSnapshot(getCollectionRef('trainings'), (snapshot) => {
            riwayatPelatihan = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (riwayatPelatihan.length === 0) {
                initialRiwayatPelatihan.forEach(async (item) => {
                    await setDoc(doc(getCollectionRef('trainings')), item);
                });
                riwayatPelatihan = initialRiwayatPelatihan;
            }
            renderApp();
        });
    }

    // --- Base64 Photo Handling (replaces Firebase Storage logic) ---
    async function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // --- Helper Functions ---
    function showMessage(message, title = 'Informasi') {
        messageModal.isOpen = true;
        messageModal.title = title;
        messageModal.message = message;
        renderApp(); // Re-render to show modal
    }

    function closeMessageModal() {
        messageModal.isOpen = false;
        renderApp();
    }

    /**
     * Renders a generic form in the data modal.
     * @param {string} title - The title of the modal.
     * @param {Array<Object>} fields - An array of field definitions.
     * Each object: { name: string, label: string, type: string, value?: string, options?: Array<Object>, required?: boolean, placeholder?: string }
     * options: [{ value: string, text: string }] for 'select' type.
     * @param {Function} submitCallback - Callback function when the form is submitted. Receives the form data.
     * @param {Object} initialData - Optional initial data to pre-fill form fields.
     */
    function renderGenericForm(title, fields, submitCallback, initialData = {}) {
        let formHtml = '';
        fields.forEach(field => {
            const value = initialData[field.name] !== undefined ? initialData[field.name] : (field.value || '');
            const requiredAttr = field.required ? 'required' : '';
            const placeholderAttr = field.placeholder ? `placeholder="${field.placeholder}"` : '';

            formHtml += `<div><label for="${field.name}" class="block text-gray-700 text-sm font-bold mb-1">${field.label}</label>`;
            switch (field.type) {
                case 'text':
                case 'email':
                case 'url':
                case 'date':
                case 'number':
                    formHtml += `<input type="${field.type}" name="${field.name}" id="${field.name}" value="${value}" class="w-full p-2 border rounded" ${requiredAttr} ${placeholderAttr} />`;
                    break;
                case 'textarea':
                    formHtml += `<textarea name="${field.name}" id="${field.name}" class="w-full p-2 border rounded" rows="${field.rows || 3}" ${requiredAttr} ${placeholderAttr}>${value}</textarea>`;
                    break;
                case 'select':
                    formHtml += `<select name="${field.name}" id="${field.name}" class="w-full p-2 border rounded" ${requiredAttr}>`;
                    if (field.placeholder) { // Add a placeholder option if provided
                        formHtml += `<option value="">${field.placeholder}</option>`;
                    }
                    field.options.forEach(option => {
                        const selectedAttr = (String(option.value) === String(value)) ? 'selected' : '';
                        formHtml += `<option value="${option.value}" ${selectedAttr}>${option.text}</option>`;
                    });
                    formHtml += `</select>`;
                    break;
                case 'file':
                    // Specific handling for photo file in Guru Profile
                    formHtml += `<input type="file" id="${field.name}" name="${field.name}" accept="${field.accept || 'image/*'}" class="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />`;
                    if (field.previewHtml) {
                        formHtml += field.previewHtml;
                    }
                    break;
            }
            formHtml += `</div>`;
        });

        showDataModal(title, formHtml, async (formElement) => {
            const formData = new FormData(formElement);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (key !== 'photoFile') { // photoFile handled separately
                    data[key] = value;
                }
            }
            submitCallback(data, formData.get('photoFile')); // Pass data object and photoFile
        });
    }
    window.renderGenericForm = renderGenericForm; // Expose to global scope for debugging/testing

    function closeDataModal() {
        dataModal.isOpen = false;
        editingItem = null; // Clear editing item
        renderApp();
    }

    function showConfirmDeleteModal(message, onConfirm) {
        confirmDeleteModal.isOpen = true;
        confirmDeleteModal.message = message;
        confirmDeleteModal.onConfirm = onConfirm;
        renderApp();
    }

    function closeConfirmDeleteModal() {
        confirmDeleteModal.isOpen = false;
        confirmDeleteModal.onConfirm = null;
        itemToDelete = null; // Clear item to delete
        renderApp();
    }

    // Generic Header component (rendered dynamically)
    function renderHeader(title, iconHtml, onBack = null, onAdd = null, showGlobalDownload = true) {
        let backButtonHtml = onBack ? `<button onclick="handleBack('${onBack}')" class="mr-4 text-gray-500 hover:text-blue-600 transition-colors"> <i data-lucide="arrow-left" class="lucide lucide-arrow-left" style="width: 24px; height: 24px;"></i> </button>` : '';
        let addButtonHtml = onAdd ? `<button onclick="${onAdd}" class="flex-1 sm:flex-initial flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-sm"> <i data-lucide="plus-circle" class="lucide lucude-plus-circle mr-2" style="width: 18px; height: 18px;"></i> Tambah </button>` : '';
        let downloadButtonHtml = showGlobalDownload ? `<button onclick="handleDownloadCurrentPage()" class="flex-1 sm:flex-initial flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-sm"> <i data-lucide="download" class="lucide lucide-download mr-2" style="width: 18px; height: 18px;"></i> PDF </button>` : '';

        return `
            <div class="bg-white p-4 shadow-md rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center">
                    ${backButtonHtml}
                    <div class="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4"> ${iconHtml} </div>
                    <h1 class="text-2xl font-bold text-gray-800">${title}</h1>
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                    ${addButtonHtml}
                    ${downloadButtonHtml}
                </div>
            </div>
        `;
    }

    function handleBack(menu) {
        activeMenu = menu;
        renderApp();
    }
    window.handleBack = handleBack; // Expose to global scope for onclick attributes

    // --- PDF Download Functionality ---
    async function handleDownloadCurrentPage() {
        const printArea = mainContent.querySelector('.print-area');
        if (!printArea) {
            showMessage('Konten tidak ditemukan untuk diunduh.', 'Kesalahan Unduh');
            return;
        }

        if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            showMessage('Perpustakaan unduhan PDF belum dimuat. Mohon tunggu sebentar.', 'Mohon Tunggu');
            return;
        }

        try {
            const canvas = await html2canvas(printArea, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // Lebar A4 dalam mm
            const pageHeight = 297; // Tinggi A4 dalam mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            let filename = activeMenu.replace(/\s+/g, '_').toLowerCase() + '.pdf';
            pdf.save(filename);
            showMessage('Dokumen berhasil diunduh sebagai PDF.', 'Unduh Berhasil');
        } catch (error) {
            console.error('Kesalahan saat membuat PDF:', error);
            showMessage('Gagal mengunduh dokumen PDF. Coba lagi.', 'Kesalahan Unduh');
        }
    }
    window.handleDownloadCurrentPage = handleDownloadCurrentPage; // Expose to global scope


    // Function to download PDF for a specific module (Modul Ajar)
    async function downloadSingleModulAjar(moduleId) {
        const module = modulAjar.find(m => m.id === moduleId);
        if (!module) {
            showMessage('Modul tidak ditemukan untuk diunduh.', 'Kesalahan Unduh');
            return;
        }

        if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            showMessage('Perpustakaan unduhan PDF belum dimuat. Mohon tunggu sebentar.', 'Mohon Tunggu');
            return;
        }

        // Periksa apakah link langsung ke file PDF
        if (module.link.toLowerCase().endsWith('.pdf')) {
            // Jika ini adalah link PDF, coba buka langsung (browser akan menangani unduhan/tampilan)
            window.open(module.link, '_blank');
            showMessage('Membuka/Mengunduh file PDF...', 'Unduh Dokumen');
            return;
        }

        // Jika bukan link PDF langsung, buat PDF berisi metadata modul
        try {
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px'; // Sembunyikan di luar layar
            tempDiv.style.width = '800px'; // Beri lebar tetap untuk rendering yang konsisten
            tempDiv.style.backgroundColor = '#fff';
            tempDiv.style.padding = '20px';
            tempDiv.innerHTML = `
                <h2 class="text-2xl font-bold mb-4">Modul Ajar: ${module.title}</h2>
                <p class="text-gray-700 mb-2">Link Modul: <a href="${module.link}" target="_blank" rel="noopener noreferrer">${module.link}</a></p>
                <p class="text-gray-500 text-sm">Dibuat pada: ${new Date().toLocaleDateString('id-ID')}</p>
            `;
            document.body.appendChild(tempDiv);

            const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`modul_ajar_${module.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);

            document.body.removeChild(tempDiv);
            showMessage('Detail modul ajar berhasil diunduh sebagai PDF.', 'Unduh Berhasil');
        } catch (error) {
            console.error('Kesalahan saat membuat PDF modul ajar:', error);
            showMessage('Gagal mengunduh modul ajar PDF. Coba lagi.', 'Kesalahan Unduh');
        }
    }
    window.downloadSingleModulAjar = downloadSingleModulAjar; // Expose to global scope


    /**
     * Renders a generic table with dynamic headers, data, and action buttons.
     * @param {string[]} headers - Array of table header names.
     * @param {Object[]} data - Array of data objects to display.
     * @param {Function} rowMapper - Function to map a data item to an array of table cell values (strings).
     * @param {Object} actions - Object defining action buttons for each row.
     * actions: {
     * edit?: { fn: (id: string) => void, icon: string, class?: string },
     * delete?: { fn: (id: string) => void, icon: string, class?: string },
     * // Add other actions like download etc.
     * }
     * @param {Object} [options={}] - Optional configuration.
     * @param {Function} [options.statusClassMapper] - Optional function to map status to Tailwind CSS class.
     */
    function renderGenericTable(headers, data, rowMapper, actions = {}, options = {}) {
        let rowsHtml = '';
        if (data.length > 0) {
            data.forEach(item => {
                const cells = rowMapper(item);
                let actionButtonsHtml = '';
                for (const actionName in actions) {
                    const action = actions[actionName];
                    let iconHtml = '';
                    if (action.icon) {
                        iconHtml = `<i data-lucide="${action.icon}" class="lucide lucide-${action.icon}" style="width: 18px; height: 18px;"></i>`;
                    }
                    actionButtonsHtml += `
                        <button onclick="${action.fnName}('${item.id}', ${action.extraArgs ? JSON.stringify(action.extraArgs) : null})" class="${action.class || 'text-gray-600 hover:text-gray-800'}">
                            ${iconHtml}
                        </button>
                    `;
                }

                let statusCell = '';
                if (options.statusField && options.statusClassMapper) {
                    const status = item[options.statusField];
                    const statusClass = options.statusClassMapper(status);
                    statusCell = `<td class="py-3 px-4"><span class="px-2 py-1 rounded-full text-xs font-semibold ${statusClass}">${status}</span></td>`;
                }

                rowsHtml += `
                    <tr class="border-b hover:bg-gray-50">
                        ${cells.map(cell => `<td class="py-3 px-4">${cell}</td>`).join('')}
                        ${statusCell}
                        <td class="py-3 px-4 flex gap-2">${actionButtonsHtml}</td>
                    </tr>
                `;
            });
        } else {
            rowsHtml = `<tr><td colspan="${headers.length + (Object.keys(actions).length > 0 ? 1 : 0) + (options.statusField ? 1 : 0)}" class="py-3 px-4 text-gray-500 italic text-center">Tidak ada data.</td></tr>`;
        }

        return `
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead>
                        <tr class="bg-blue-100 text-blue-800">
                            ${headers.map(header => `<th class="py-3 px-4 text-left">${header}</th>`).join('')}
                            ${(options.statusField && !headers.includes('Status')) ? `<th class="py-3 px-4 text-left">Status</th>` : ''}
                            ${Object.keys(actions).length > 0 ? `<th class="py-3 px-4 text-left w-24">Aksi</th>` : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    }
    window.renderGenericTable = renderGenericTable; // Expose to global scope


    // --- Komponen Tampilan Konten (sebagai fungsi yang mengembalikan string HTML) ---

    function renderProfilGuruContent() {
        let photoPreviewHtml = guruProfile.photo ? `
            <div class="mt-4 flex items-center gap-4 p-2 border rounded-lg bg-gray-50">
                <img id="modal-preview-photo" src="${guruProfile.photo}" onerror="this.onerror=null; this.src='https://placehold.co/128x128/E0E7FF/4F46E5?text=Gagal+Muat';" alt="Pratinjau Foto" class="w-20 h-20 rounded-full object-cover shadow-sm border border-gray-200" />
                <button type="button" id="clear-photo-button" class="flex items-center text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-md border border-red-300 bg-white hover:bg-red-50">
                    <i data-lucide="trash-2" class="lucide lucide-trash-2 mr-1" style="width: 16px; height: 16px;"></i> Hapus Foto
                </button>
            </div>
        ` : '';

        const fields = [
            { name: "name", label: "Nama Lengkap", type: "text", required: true },
            { name: "nip", label: "NIP", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "whatsapp", label: "Nomor Whatsapp", type: "text" },
            { name: "photoFile", label: "Unggah Foto Profil (Ukuran Max 100KB - untuk performa)", type: "file", accept: "image/*", previewHtml: photoPreviewHtml }
        ];

        const handleSaveProfile = async (data, photoFile) => {
            let newPhotoUrl = guruProfile.photo;

            if (photoFile && photoFile.size > 0) {
                const MAX_FILE_SIZE_BYTES = 100 * 1024;
                if (photoFile.size > MAX_FILE_SIZE_BYTES) {
                    showMessage(`Ukuran file foto maksimum adalah ${MAX_FILE_SIZE_BYTES / 1024} KB.`, 'Ukuran File Terlalu Besar');
                    return;
                }
                loadingOverlay.style.display = 'flex';
                try {
                    newPhotoUrl = await convertFileToBase64(photoFile);
                } catch (error) {
                    console.error("Error converting image to Base64:", error);
                    showMessage(`Gagal memproses foto: ${error.message}`, 'Kesalahan Pemrosesan');
                    return;
                } finally {
                    loadingOverlay.style.display = 'none';
                }
            } else if (photoFile && photoFile.size === 0 && guruProfile.photo !== 'https://placehold.co/128x128/E0E7FF/4F46E5?text=Foto') {
                // If file input is explicitly cleared (and not already placeholder), keep old photo or handle as clear
                // This condition relies on the clear button directly setting guruProfile.photo
            }

            const updatedProfile = { ...data, photo: newPhotoUrl };
            try {
                await setDoc(getDocRef('profile', 'guruProfileDoc'), updatedProfile);
                guruProfile = updatedProfile;
                closeDataModal();
                showMessage('Profil guru berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating guru profile:", error);
                showMessage(`Gagal memperbarui profil guru: ${error.message}. Coba gunakan foto dengan ukuran lebih kecil.`, 'Kesalahan');
            }
        };

        const contentHtml = `
            <div id="profile-print-area" class="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8 print-area">
                <div class="flex-shrink-0">
                    <img src="${guruProfile.photo}" onerror="this.onerror=null; this.src='https://placehold.co/128x128/E0E7FF/4F46E5?text=Gagal+Muat';" alt="Foto Profil Guru" class="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-blue-200" />
                </div>
                <div class="flex-grow">
                    <h2 class="text-3xl font-bold text-gray-800">${guruProfile.name}</h2>
                    <p class="text-lg text-gray-500 mb-4">NIP. ${guruProfile.nip}</p>
                    <div class="space-y-2">
                        <div class="flex items-center text-gray-700"> <i data-lucide="mail" class="lucide lucide-mail mr-3 text-blue-500" style="width: 20px; height: 20px;"></i> <span>${guruProfile.email}</span> </div>
                        <div class="flex items-center text-gray-700"> <i data-lucide="phone" class="lucide lucide-phone mr-3 text-green-500" style="width: 20px; height: 20px;"></i> <span>${guruProfile.whatsapp}</span> </div>
                    </div>
                </div>
                <button id="edit-profile-button" class="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-sm flex items-center"> <i data-lucide="edit" class="lucide lucide-edit mr-2" style="width: 18px; height: 18px;"></i> Ubah Profil </button>
            </div>
        `;

        setTimeout(() => {
            const editButton = document.getElementById('edit-profile-button');
            if (editButton) {
                editButton.onclick = () => {
                    renderGenericForm("Ubah Profil Guru", fields, handleSaveProfile, guruProfile);
                    const photoFileInput = document.getElementById('photoFile');
                    if (photoFileInput) {
                        photoFileInput.onchange = async (e) => {
                            const file = e.target.files[0];
                            const modalPreviewPhoto = document.getElementById('modal-preview-photo');
                            if (file) {
                                const MAX_FILE_SIZE_BYTES = 100 * 1024;
                                if (file.size > MAX_FILE_SIZE_BYTES) {
                                    showMessage(`Ukuran file maksimum adalah ${MAX_FILE_SIZE_BYTES / 1024} KB.`, 'Ukuran File Terlalu Besar');
                                    e.target.value = '';
                                    if (modalPreviewPhoto) modalPreviewPhoto.src = guruProfile.photo;
                                    return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => { if (modalPreviewPhoto) modalPreviewPhoto.src = reader.result; };
                                reader.readAsDataURL(file);
                            } else {
                                if (modalPreviewPhoto) modalPreviewPhoto.src = guruProfile.photo;
                            }
                        };
                    }
                    const clearPhotoButton = document.getElementById('clear-photo-button');
                    if (clearPhotoButton) {
                        clearPhotoButton.onclick = async () => {
                            guruProfile.photo = 'https://placehold.co/128x128/E0E7FF/4F46E5?text=Foto';
                            const modalPreviewPhoto = document.getElementById('modal-preview-photo');
                            if (modalPreviewPhoto) modalPreviewPhoto.src = guruProfile.photo;
                            const photoInput = document.getElementById('photoFile');
                            if (photoInput) photoInput.value = '';

                            try {
                                await updateDoc(getDocRef('profile', 'guruProfileDoc'), { photo: guruProfile.photo });
                                showMessage('Foto profil berhasil dihapus.', 'Berhasil');
                            } catch (error) {
                                console.error("Error clearing photo in Firestore:", error);
                                showMessage(`Gagal menghapus foto: ${error.message}.`, 'Kesalahan');
                            }
                        };
                    }
                };
            }
        }, 0);

        return contentHtml;
    }

    function renderJadwalMengajarContent() {
        initializeScheduleListener();

        let rowsHtml = '';
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

        days.forEach(day => {
            rowsHtml += `<div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">${day}</h3>`;
            const lessonsForDay = schedule[day] || [];

            const headers = ['Waktu', 'Mata Pelajaran'];
            const rowMapper = (lesson) => [lesson.time, lesson.subject];
            const actions = {
                edit: { fnName: 'editLesson', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800', extraArgs: day },
                delete: { fnName: 'confirmDeleteLesson', icon: 'trash-2', class: 'text-red-600 hover:text-red-800', extraArgs: day }
            };

            if (lessonsForDay.length > 0) {
                rowsHtml += `
                    <ul class="space-y-3">
                        ${lessonsForDay.map(lesson => `
                            <li class="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm">
                                <div>
                                    <p class="text-lg font-medium text-blue-800">${lesson.time}</p>
                                    <p class="text-gray-700">${lesson.subject}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editLesson('${day}', '${lesson.id}')" class="text-yellow-600 hover:text-yellow-800"> <i data-lucide="edit" class="lucide lucide-edit" style="width: 20px; height: 20px;"></i> </button>
                                    <button onclick="confirmDeleteLesson('${day}', '${lesson.id}')" class="text-red-600 hover:text-red-800"> <i data-lucide="trash-2" class="lucide lucide-trash-2" style="width: 20px; height: 20px;"></i> </button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                `;
            } else {
                rowsHtml += `<p class="text-gray-500 italic">Tidak ada jadwal untuk hari ${day}.</p>`;
            }
            rowsHtml += `</div>`;
        });

        const contentHtml = `<div id="schedule-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">${rowsHtml}</div>`;
        return contentHtml;
    }

    window.addLesson = () => {
        editingItem = null;
        const fields = [
            { name: "day", label: "Hari", type: "select", required: true, options: Object.keys(initialSchedule).map(day => ({ value: day, text: day })) },
            { name: "time", label: "Waktu", type: "text", placeholder: "Contoh: 07:30 - 09:00", required: true },
            { name: "subject", label: "Mata Pelajaran", type: "text", placeholder: "Contoh: Matematika", required: true }
        ];
        renderGenericForm("Tambah Jadwal Pelajaran Baru", fields, async (data) => {
            const newLesson = { id: Date.now().toString(), time: data.time, subject: data.subject };
            const day = data.day;
            try {
                const dayDocRef = getDocRef('schedules', day);
                const docSnap = await getDoc(dayDocRef);
                let lessons = docSnap.exists() ? docSnap.data().lessons || [] : [];
                lessons.push(newLesson);
                lessons.sort((a, b) => a.time.localeCompare(b.time));
                await setDoc(dayDocRef, { lessons: lessons });
                closeDataModal();
                showMessage('Jadwal pelajaran baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding lesson:", error);
                showMessage(`Gagal menambahkan pelajaran: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editLesson = (day, lessonId) => {
        const lesson = schedule[day].find(l => l.id === lessonId);
        if (!lesson) return;
        editingItem = { day, lesson };
        const fields = [
            { name: "day", label: "Hari", type: "select", required: true, options: Object.keys(initialSchedule).map(d => ({ value: d, text: d })), value: day },
            { name: "time", label: "Waktu", type: "text", placeholder: "Contoh: 07:30 - 09:00", required: true, value: lesson.time },
            { name: "subject", label: "Mata Pelajaran", type: "text", placeholder: "Contoh: Matematika", required: true, value: lesson.subject }
        ];
        renderGenericForm("Ubah Jadwal Pelajaran", fields, async (data) => {
            const updatedLesson = { id: editingItem.lesson.id, time: data.time, subject: data.subject };
            const newDay = data.day;
            const originalDay = editingItem.day;

            try {
                if (originalDay !== newDay) {
                    const originalDayDocRef = getDocRef('schedules', originalDay);
                    const originalDocSnap = await getDoc(originalDayDocRef);
                    if (originalDocSnap.exists()) {
                        const originalLessons = originalDocSnap.data().lessons.filter(l => l.id !== updatedLesson.id);
                        await setDoc(originalDayDocRef, { lessons: originalLessons });
                    }

                    const newDayDocRef = getDocRef('schedules', newDay);
                    const newDocSnap = await getDoc(newDayDocRef);
                    let newLessons = newDocSnap.exists() ? newDocSnap.data().lessons || [] : [];
                    newLessons.push(updatedLesson);
                    newLessons.sort((a, b) => a.time.localeCompare(b.time));
                    await setDoc(newDayDocRef, { lessons: newLessons });
                } else {
                    const dayDocRef = getDocRef('schedules', originalDay);
                    const docSnap = await getDoc(dayDocRef);
                    if (docSnap.exists()) {
                        let lessons = docSnap.data().lessons || [];
                        lessons = lessons.map(l => (l.id === updatedLesson.id ? updatedLesson : l));
                        lessons.sort((a, b) => a.time.localeCompare(b.time));
                        await setDoc(dayDocRef, { lessons: lessons });
                    }
                }
                closeDataModal();
                showMessage('Jadwal pelajaran berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error editing lesson:", error);
                showMessage(`Gagal memperbarui pelajaran: ${error.message}`, 'Kesalahan');
            }
        }, lesson); // Pass lesson object as initial data
    };

    window.confirmDeleteLesson = (day, lessonId) => {
        itemToDelete = { day, lessonId };
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus jadwal pelajaran ini?", async () => {
            if (!itemToDelete) return;
            const { day, lessonId } = itemToDelete;
            try {
                const dayDocRef = getDocRef('schedules', day);
                const docSnap = await getDoc(dayDocRef);
                if (docSnap.exists()) {
                    const updatedLessons = docSnap.data().lessons.filter(l => l.id !== lessonId);
                    await setDoc(dayDocRef, { lessons: updatedLessons });
                }
                closeConfirmDeleteModal();
                showMessage('Jadwal pelajaran berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting lesson:", error);
                showMessage(`Gagal menghapus pelajaran: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderDaftarSiswaContent() {
        initializeStudentsListener();

        const headers = ['NISN', 'Nama', 'Jenis Kelamin', 'Tanggal Lahir', 'Orang Tua/Wali', 'Alamat'];
        const rowMapper = (student) => [
            student.nisn,
            student.name,
            student.gender,
            new Date(student.birthDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
            student.parent,
            student.address
        ];
        const actions = {
            edit: { fnName: 'editStudent', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            delete: { fnName: 'confirmDeleteStudent', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };

        const contentHtml = `
            <div id="student-list-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                ${renderGenericTable(headers, studentData, rowMapper, actions)}
            </div>
        `;
        return contentHtml;
    }

    window.addStudent = () => {
        editingItem = null;
        const fields = [
            { name: "nisn", label: "NISN", type: "text", required: true },
            { name: "name", label: "Nama Lengkap", type: "text", required: true },
            { name: "gender", label: "Jenis Kelamin", type: "select", required: true, placeholder: "Pilih Jenis Kelamin", options: [{ value: "Laki-laki", text: "Laki-laki" }, { value: "Perempuan", text: "Perempuan" }] },
            { name: "birthPlace", label: "Tempat Lahir", type: "text", required: true },
            { name: "birthDate", label: "Tanggal Lahir", type: "date", required: true },
            { name: "parent", label: "Nama Orang Tua/Wali", type: "text", required: true },
            { name: "address", label: "Alamat Lengkap", type: "textarea", rows: 3 }
        ];
        renderGenericForm("Tambah Siswa Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('students'), data);
                closeDataModal();
                showMessage('Siswa baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding student:", error);
                showMessage(`Gagal menambahkan siswa: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editStudent = (studentId) => {
        const student = studentData.find(s => s.id === studentId);
        if (!student) return;
        editingItem = student;
        const fields = [
            { name: "nisn", label: "NISN", type: "text", required: true, value: student.nisn },
            { name: "name", label: "Nama Lengkap", type: "text", required: true, value: student.name },
            { name: "gender", label: "Jenis Kelamin", type: "select", required: true, placeholder: "Pilih Jenis Kelamin", options: [{ value: "Laki-laki", text: "Laki-laki" }, { value: "Perempuan", text: "Perempuan" }], value: student.gender },
            { name: "birthPlace", label: "Tempat Lahir", type: "text", required: true, value: student.birthPlace },
            { name: "birthDate", label: "Tanggal Lahir", type: "date", required: true, value: student.birthDate },
            { name: "parent", label: "Nama Orang Tua/Wali", type: "text", required: true, value: student.parent },
            { name: "address", label: "Alamat Lengkap", type: "textarea", rows: 3, value: student.address }
        ];
        renderGenericForm("Ubah Data Siswa", fields, async (data) => {
            try {
                await updateDoc(getDocRef('students', editingItem.id), data);
                closeDataModal();
                showMessage('Data siswa berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating student:", error);
                showMessage(`Gagal memperbarui siswa: ${error.message}`, 'Kesalahan');
            }
        }, student);
    };

    window.confirmDeleteStudent = (studentId) => {
        itemToDelete = studentId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus data siswa ini?", async () => {
            try {
                await deleteDoc(getDocRef('students', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Data siswa berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting student:", error);
                showMessage(`Gagal menghapus siswa: ${error.message}`, 'Kesalahan');
            }
        });
    };

    function renderDaftarHadirContent() {
        initializeDaftarHadirListener();

        let filteredDaftarHadir = selectedDateDaftarHadir
            ? daftarHadir.filter(item => item.date === selectedDateDaftarHadir)
            : daftarHadir;

        // Removing the attendance recap logic and display
        // const attendanceRecap = filteredDaftarHadir.reduce((acc, curr) => {
        //     if (!acc[curr.date]) {
        //         acc[curr.date] = { Hadir: 0, Sakit: 0, Izin: 0, Alpha: 0, totalStudents: studentData.length };
        //     }
        //     acc[curr.date][curr.status]++;
        //     return acc;
        // }, {});

        // const recapHeaders = ['Tanggal', 'Hadir', 'Sakit', 'Izin', 'Alpha', 'Total Siswa'];
        // const recapRowMapper = (item) => [
        //     new Date(item[0]).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        //     item[1].Hadir,
        //     item[1].Sakit,
        //     item[1].Izin,
        //     item[1].Alpha,
        //     item[1].totalStudents
        // ];
        // const sortedRecapData = Object.entries(attendanceRecap).sort((a, b) => a[0].localeCompare(b[0]));
        // let recapHtml = sortedRecapData.length > 0
        //     ? `<h3 class="text-xl font-semibold text-gray-700 mb-4">Rekapitulasi Kehadiran</h3>${renderGenericTable(recapHeaders, sortedRecapData, recapRowMapper)}`
        //     : `<p class="text-gray-500 italic mb-4">Tidak ada data rekapitulasi untuk tanggal ini.</p>`;


        const detailHeaders = ['Tanggal', 'Nama Siswa', 'Status'];
        const detailRowMapper = (attendance) => [
            new Date(attendance.date).toLocaleDateString('id-ID'),
            attendance.studentName,
            attendance.status // Status will be handled by statusClassMapper
        ];
        const detailActions = {
            edit: { fnName: 'editAttendance', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            delete: { fnName: 'confirmDeleteAttendance', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };
        const statusClassMapper = (status) => {
            if (status === 'Hadir') return 'bg-green-100 text-green-800';
            if (status === 'Sakit') return 'bg-yellow-100 text-yellow-800';
            if (status === 'Izin') return 'bg-blue-100 text-blue-800';
            return 'bg-red-100 text-red-800';
        };

        const contentHtml = `
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 class="text-xl font-semibold text-gray-700 mb-3">Filter Berdasarkan Tanggal</h3>
                <input type="date" id="attendance-date-filter" value="${selectedDateDaftarHadir}" class="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                ${selectedDateDaftarHadir ? `<button onclick="clearAttendanceDateFilter()" class="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-lg text-sm">Hapus Filter</button>` : ''}
            </div>
            <div id="daftar-hadir-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                <h3 class="text-xl font-semibold text-gray-700 mb-4">Detail Kehadiran</h3>
                ${renderGenericTable(detailHeaders, filteredDaftarHadir, detailRowMapper, detailActions, { statusField: 'status', statusClassMapper: statusClassMapper })}
            </div>
        `;

        setTimeout(() => {
            document.getElementById('attendance-date-filter').onchange = (e) => {
                selectedDateDaftarHadir = e.target.value;
                renderApp();
            };
        }, 0);
        return contentHtml;
    }

    window.clearAttendanceDateFilter = () => {
        selectedDateDaftarHadir = '';
        renderApp();
    };

    window.addAttendance = () => {
        editingItem = null;
        const studentOptions = studentData.map(s => ({ value: s.name, text: s.name }));
        const fields = [
            { name: "date", label: "Tanggal", type: "date", required: true },
            { name: "studentName", label: "Nama Siswa", type: "select", required: true, placeholder: "Pilih Siswa", options: studentOptions },
            { name: "status", label: "Status", type: "select", required: true, placeholder: "Pilih Status", options: [{ value: "Hadir", text: "Hadir" }, { value: "Sakit", text: "Sakit" }, { value: "Izin", text: "Izin" }, { value: "Alpha", text: "Alpha" }] }
        ];
        renderGenericForm("Tambah Data Kehadiran Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('attendance'), data);
                closeDataModal();
                showMessage('Data kehadiran baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding attendance:", error);
                showMessage(`Gagal menambahkan kehadiran: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editAttendance = (attendanceId) => {
        const attendance = daftarHadir.find(a => a.id === attendanceId);
        if (!attendance) return;
        editingItem = attendance;
        const studentOptions = studentData.map(s => ({ value: s.name, text: s.name }));
        const fields = [
            { name: "date", label: "Tanggal", type: "date", required: true, value: attendance.date },
            { name: "studentName", label: "Nama Siswa", type: "select", required: true, placeholder: "Pilih Siswa", options: studentOptions, value: attendance.studentName },
            { name: "status", label: "Status", type: "select", required: true, placeholder: "Pilih Status", options: [{ value: "Hadir", text: "Hadir" }, { value: "Sakit", text: "Sakit" }, { value: "Izin", text: "Izin" }, { value: "Alpha", text: "Alpha" }], value: attendance.status }
        ];
        renderGenericForm("Ubah Data Kehadiran", fields, async (data) => {
            try {
                await updateDoc(getDocRef('attendance', editingItem.id), data);
                closeDataModal();
                showMessage('Data kehadiran berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating attendance:", error);
                showMessage(`Gagal memperbarui kehadiran: ${error.message}`, 'Kesalahan');
            }
        }, attendance);
    };

    window.confirmDeleteAttendance = (attendanceId) => {
        itemToDelete = attendanceId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus data kehadiran ini?", async () => {
            try {
                await deleteDoc(getDocRef('attendance', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Data kehadiran berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting attendance:", error);
                showMessage(`Gagal menghapus kehadiran: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderProgramSemesterTahunanContent() {
        initializeProgramSemesterTahunanListener();

        const headers = ['Nama Program', 'Deskripsi', 'Tahun'];
        const rowMapper = (program) => [program.programName, program.description, program.year];
        const actions = {
            edit: { fnName: 'editProgramSemesterTahunan', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            delete: { fnName: 'confirmDeleteProgramSemesterTahunan', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };

        const contentHtml = `
            <div id="program-semester-tahunan-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                ${renderGenericTable(headers, programSemesterTahunan, rowMapper, actions)}
            </div>
        `;
        return contentHtml;
    }

    window.addProgramSemesterTahunan = () => {
        editingItem = null;
        const fields = [
            { name: "programName", label: "Nama Program", type: "text", required: true },
            { name: "description", label: "Deskripsi Program", type: "textarea", rows: 3 },
            { name: "year", label: "Tahun", type: "text", required: true }
        ];
        renderGenericForm("Tambah Program Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('semester_programs'), data);
                closeDataModal();
                showMessage('Program baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding program semester tahunan:", error);
                showMessage(`Gagal menambahkan program: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editProgramSemesterTahunan = (programId) => {
        const program = programSemesterTahunan.find(p => p.id === programId);
        if (!program) return;
        editingItem = program;
        const fields = [
            { name: "programName", label: "Nama Program", type: "text", required: true, value: program.programName },
            { name: "description", label: "Deskripsi Program", type: "textarea", rows: 3, value: program.description },
            { name: "year", label: "Tahun", type: "text", required: true, value: program.year }
        ];
        renderGenericForm("Ubah Program", fields, async (data) => {
            try {
                await updateDoc(getDocRef('semester_programs', editingItem.id), data);
                closeDataModal();
                showMessage('Program berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating program semester tahunan:", error);
                showMessage(`Gagal memperbarui program: ${error.message}`, 'Kesalahan');
            }
        }, program);
    };

    window.confirmDeleteProgramSemesterTahunan = (programId) => {
        itemToDelete = programId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus program ini?", async () => {
            try {
                await deleteDoc(getDocRef('semester_programs', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Program berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting program semester tahunan:", error);
                showMessage(`Gagal menghapus program: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderKalenderPendidikanContent() {
        initializeKalenderPendidikanListener();

        const headers = ['Nama Acara', 'Tanggal', 'Catatan'];
        const rowMapper = (event) => [
            event.eventName,
            new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
            event.notes
        ];
        const actions = {
            edit: { fnName: 'editCalendarEvent', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            delete: { fnName: 'confirmDeleteCalendarEvent', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };

        const contentHtml = `
            <div id="kalender-pendidikan-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                ${renderGenericTable(headers, kalenderPendidikan, rowMapper, actions)}
            </div>
        `;
        return contentHtml;
    }

    window.addCalendarEvent = () => {
        editingItem = null;
        const fields = [
            { name: "eventName", label: "Nama Acara", type: "text", required: true },
            { name: "date", label: "Tanggal", type: "date", required: true },
            { name: "notes", label: "Catatan", type: "textarea", rows: 3 }
        ];
        renderGenericForm("Tambah Acara Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('calendar_events'), data);
                closeDataModal();
                showMessage('Acara baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding calendar event:", error);
                showMessage(`Gagal menambahkan acara: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editCalendarEvent = (eventId) => {
        const event = kalenderPendidikan.find(ev => ev.id === eventId);
        if (!event) return;
        editingItem = event;
        const fields = [
            { name: "eventName", label: "Nama Acara", type: "text", required: true, value: event.eventName },
            { name: "date", label: "Tanggal", type: "date", required: true, value: event.date },
            { name: "notes", label: "Catatan", type: "textarea", rows: 3, value: event.notes }
        ];
        renderGenericForm("Ubah Acara", fields, async (data) => {
            try {
                await updateDoc(getDocRef('calendar_events', editingItem.id), data);
                closeDataModal();
                showMessage('Acara berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating calendar event:", error);
                showMessage(`Gagal memperbarui acara: ${error.message}`, 'Kesalahan');
            }
        }, event);
    };

    window.confirmDeleteCalendarEvent = (eventId) => {
        itemToDelete = eventId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus acara ini?", async () => {
            try {
                await deleteDoc(getDocRef('calendar_events', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Acara berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting calendar event:", error);
                showMessage(`Gagal menghapus acara: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderDaftarNilaiContent() {
        initializeDaftarNilaiListener();

        const headers = ['Mata Pelajaran', 'Link Google Sheet'];
        const rowMapper = (entry) => [
            entry.subjectName,
            `<a href="${entry.googleSheetLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Buka Link</a>`
        ];
        const actions = {
            edit: { fnName: 'editDaftarNilaiEntry', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            delete: { fnName: 'confirmDeleteDaftarNilaiEntry', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };

        const contentHtml = `
            <div id="daftar-nilai-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                ${renderGenericTable(headers, daftarNilai, rowMapper, actions)}
            </div>
        `;
        return contentHtml;
    }

    window.addDaftarNilaiEntry = () => {
        editingItem = null;
        const fields = [
            { name: "subjectName", label: "Nama Mata Pelajaran", type: "text", required: true },
            { name: "googleSheetLink", label: "Link Google Sheet", type: "url", required: true }
        ];
        renderGenericForm("Tambah Entri Daftar Nilai Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('grades'), data);
                closeDataModal();
                showMessage('Entri daftar nilai baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding daftar nilai entry:", error);
                showMessage(`Gagal menambahkan entri: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editDaftarNilaiEntry = (entryId) => {
        const entry = daftarNilai.find(e => e.id === entryId);
        if (!entry) return;
        editingItem = entry;
        const fields = [
            { name: "subjectName", label: "Nama Mata Pelajaran", type: "text", required: true, value: entry.subjectName },
            { name: "googleSheetLink", label: "Link Google Sheet", type: "url", required: true, value: entry.googleSheetLink }
        ];
        renderGenericForm("Ubah Entri Daftar Nilai", fields, async (data) => {
            try {
                await updateDoc(getDocRef('grades', editingItem.id), data);
                closeDataModal();
                showMessage('Entri daftar nilai berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating daftar nilai entry:", error);
                showMessage(`Gagal memperbarui entri: ${error.message}`, 'Kesalahan');
            }
        }, entry);
    };

    window.confirmDeleteDaftarNilaiEntry = (entryId) => {
        itemToDelete = entryId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus entri daftar nilai ini?", async () => {
            try {
                await deleteDoc(getDocRef('grades', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Entri daftar nilai berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting daftar nilai entry:", error);
                showMessage(`Gagal menghapus entri: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderAsesmenContent() {
        initializeAsesmenListener();

        const headers = ['Nama Asesmen', 'Tanggal', 'Mata Pelajaran', 'Link'];
        const rowMapper = (assessment) => [
            assessment.assessmentName,
            new Date(assessment.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
            assessment.subject,
            `<a href="${assessment.link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Buka Link</a>`
        ];
        const actions = {
            edit: { fnName: 'editAssessment', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            delete: { fnName: 'confirmDeleteAssessment', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };

        const contentHtml = `
            <div id="asesmen-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                ${renderGenericTable(headers, asesmen, rowMapper, actions)}
            </div>
        `;
        return contentHtml;
    }

    window.addAssessment = () => {
        editingItem = null;
        const fields = [
            { name: "assessmentName", label: "Nama Asesmen", type: "text", required: true },
            { name: "date", label: "Tanggal", type: "date", required: true },
            { name: "subject", label: "Mata Pelajaran", type: "text", required: true },
            { name: "link", label: "Link Asesmen (URL)", type: "url", required: true }
        ];
        renderGenericForm("Tambah Asesmen Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('assessments'), data);
                closeDataModal();
                showMessage('Asesmen baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding assessment:", error);
                showMessage(`Gagal menambahkan asesmen: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editAssessment = (assessmentId) => {
        const assessment = asesmen.find(a => a.id === assessmentId);
        if (!assessment) return;
        editingItem = assessment;
        const fields = [
            { name: "assessmentName", label: "Nama Asesmen", type: "text", required: true, value: assessment.assessmentName },
            { name: "date", label: "Tanggal", type: "date", required: true, value: assessment.date },
            { name: "subject", label: "Mata Pelajaran", type: "text", required: true, value: assessment.subject },
            { name: "link", label: "Link Asesmen (URL)", type: "url", required: true, value: assessment.link }
        ];
        renderGenericForm("Ubah Asesmen", fields, async (data) => {
            try {
                await updateDoc(getDocRef('assessments', editingItem.id), data);
                closeDataModal();
                showMessage('Asesmen berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating assessment:", error);
                showMessage(`Gagal memperbarui asesmen: ${error.message}`, 'Kesalahan');
            }
        }, assessment);
    };

    window.confirmDeleteAssessment = (assessmentId) => {
        itemToDelete = assessmentId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus asesmen ini?", async () => {
            try {
                await deleteDoc(getCollectionRef('assessments', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Asesmen berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting assessment:", error);
                showMessage(`Gagal menghapus asesmen: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderModulAjarContent() {
        initializeModulAjarListener();

        const headers = ['Judul Modul', 'Link'];
        const rowMapper = (module) => [
            module.title,
            `<a href="${module.link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Buka Link</a>`
        ];
        const actions = {
            edit: { fnName: 'editModulAjar', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            download: { fnName: 'downloadSingleModulAjar', icon: 'download', class: 'text-blue-600 hover:text-blue-800' },
            delete: { fnName: 'confirmDeleteModulAjar', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };

        const contentHtml = `
            <div id="modul-ajar-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                ${renderGenericTable(headers, modulAjar, rowMapper, actions)}
            </div>
        `;
        return contentHtml;
    }

    window.addModulAjar = () => {
        editingItem = null;
        const fields = [
            { name: "title", label: "Judul Modul", type: "text", required: true },
            { name: "link", label: "Link Modul (URL)", type: "url", required: true }
        ];
        renderGenericForm("Tambah Modul Ajar Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('teaching_modules'), data);
                closeDataModal();
                showMessage('Modul ajar baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding modul ajar:", error);
                showMessage(`Gagal menambahkan modul ajar: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editModulAjar = (moduleId) => {
        const module = modulAjar.find(m => m.id === moduleId);
        if (!module) return;
        editingItem = module;
        const fields = [
            { name: "title", label: "Judul Modul", type: "text", required: true, value: module.title },
            { name: "link", label: "Link Modul (URL)", type: "url", required: true, value: module.link }
        ];
        renderGenericForm("Ubah Modul Ajar", fields, async (data) => {
            try {
                await updateDoc(getDocRef('teaching_modules', editingItem.id), data);
                closeDataModal();
                showMessage('Modul ajar berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating modul ajar:", error);
                showMessage(`Gagal memperbarui modul ajar: ${error.message}`, 'Kesalahan');
            }
        }, module);
    };

    window.confirmDeleteModulAjar = (moduleId) => {
        itemToDelete = moduleId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus modul ajar ini?", async () => {
            try {
                await deleteDoc(getCollectionRef('teaching_modules', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Modul ajar berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting modul ajar:", error);
                showMessage(`Gagal menghapus modul ajar: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderRiwayatPelatihanContent() {
        initializeRiwayatPelatihanListener();

        const headers = ['Topik', 'Penyelenggara', 'Tanggal'];
        const rowMapper = (training) => [
            training.topic,
            training.organizer,
            new Date(training.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        ];
        const actions = {
            edit: { fnName: 'editRiwayatPelatihan', icon: 'edit', class: 'text-yellow-600 hover:text-yellow-800' },
            delete: { fnName: 'confirmDeleteRiwayatPelatihan', icon: 'trash-2', class: 'text-red-600 hover:text-red-800' }
        };

        const contentHtml = `
            <div id="riwayat-pelatihan-print-area" class="bg-white p-6 rounded-lg shadow-md print-area">
                ${renderGenericTable(headers, riwayatPelatihan, rowMapper, actions)}
            </div>
        `;
        return contentHtml;
    }

    window.addRiwayatPelatihan = () => {
        editingItem = null;
        const fields = [
            { name: "topic", label: "Topik Pelatihan", type: "text", required: true },
            { name: "organizer", label: "Penyelenggara", type: "text", required: true },
            { name: "date", label: "Tanggal", type: "date", required: true }
        ];
        renderGenericForm("Tambah Riwayat Pelatihan Baru", fields, async (data) => {
            try {
                await addDoc(getCollectionRef('trainings'), data);
                closeDataModal();
                showMessage('Riwayat pelatihan baru berhasil ditambahkan.', 'Berhasil');
            } catch (error) {
                console.error("Error adding training:", error);
                showMessage(`Gagal menambahkan pelatihan: ${error.message}`, 'Kesalahan');
            }
        });
    };

    window.editRiwayatPelatihan = (trainingId) => {
        const training = riwayatPelatihan.find(t => t.id === trainingId);
        if (!training) return;
        editingItem = training;
        const fields = [
            { name: "topic", label: "Topik Pelatihan", type: "text", required: true, value: training.topic },
            { name: "organizer", label: "Penyelenggara", type: "text", required: true, value: training.organizer },
            { name: "date", label: "Tanggal", type: "date", required: true, value: training.date }
        ];
        renderGenericForm("Ubah Riwayat Pelatihan", fields, async (data) => {
            try {
                await updateDoc(getDocRef('trainings', editingItem.id), data);
                closeDataModal();
                showMessage('Riwayat pelatihan berhasil diperbarui.', 'Berhasil');
            } catch (error) {
                console.error("Error updating training:", error);
                showMessage(`Gagal memperbarui pelatihan: ${error.message}`, 'Kesalahan');
            }
        }, training);
    };

    window.confirmDeleteRiwayatPelatihan = (trainingId) => {
        itemToDelete = trainingId;
        showConfirmDeleteModal("Apakah Anda yakin ingin menghapus riwayat pelatihan ini?", async () => {
            try {
                await deleteDoc(getCollectionRef('trainings', itemToDelete));
                closeConfirmDeleteModal();
                showMessage('Riwayat pelatihan berhasil dihapus.', 'Berhasil');
            } catch (error) {
                console.error("Error deleting training:", error);
                showMessage(`Gagal menghapus pelatihan: ${error.message}`, 'Kesalahan');
            }
        });
    };


    function renderDashboardContent() {
        const cardData = [
            { title: "Daftar Siswa", icon: "users", menu: "Daftar Siswa", bgColor: "bg-rose-500" },
            { title: "Jadwal Mengajar", icon: "calendar", menu: "Jadwal Mengajar", bgColor: "bg-emerald-500" },
            { title: "Daftar Hadir", icon: "check-square", menu: "Daftar Hadir", bgColor: "bg-amber-500" },
            { title: "Program Semester & Tahunan", icon: "book", menu: "Program Semester & Tahunan", bgColor: "bg-fuchsia-500" },
            { title: "Kalender Pendidikan", icon: "calendar", menu: "Kalender Pendidikan", bgColor: "bg-violet-500" },
            { title: "Daftar Nilai", icon: "clipboard-list", menu: "Daftar Nilai", bgColor: "bg-sky-500" },
            { title: "Asesmen", icon: "target", menu: "Asesmen", bgColor: "bg-lime-500" },
            { title: "Modul Ajar", icon: "book", menu: "Modul Ajar", bgColor: "bg-indigo-500" },
            { title: "Riwayat Pelatihan", icon: "graduation-cap", menu: "Riwayat Pelatihan", bgColor: "bg-purple-500" },
        ];

        let cardsHtml = '';
        cardData.forEach(card => {
            // Determine the text color for the icon based on the card's background color
            const iconTextColorClass = card.bgColor.replace('bg-', 'text-'); // e.g., 'bg-rose-500' -> 'text-rose-500'

            cardsHtml += `
                <div class="${card.bgColor} rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
                    onclick="setActiveMenu('${card.menu}')">
                    <div class="bg-white ${iconTextColorClass} p-4 rounded-full mb-4"> <i data-lucide="${card.icon}" class="lucide lucide-${card.icon}" style="width: 36px; height: 36px;"></i> </div>
                    <h3 class="text-xl font-semibold text-white">${card.title}</h3>
                </div>
            `;
        });

        const contentHtml = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${cardsHtml}
            </div>
        `;
        return contentHtml;
    }


    // --- Centralized Page Content Renderer ---
    function renderPageContent() {
        let contentHtml = '';
        let headerTitle = '';
        let headerIconHtml = '';
        let headerOnBack = null;
        let headerOnAdd = null;
        let showGlobalDownload = true;

        switch (activeMenu) {
            case 'Dashboard':
                headerTitle = "Dashboard";
                headerIconHtml = '<i data-lucide="layout-dashboard" style="width: 24px; height: 24px;"></i>';
                showGlobalDownload = false; // No download button for Dashboard
                contentHtml = renderDashboardContent();
                break;
            case 'Profil Guru':
                headerTitle = "Profil Guru";
                headerIconHtml = '<i data-lucide="user-circle" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                contentHtml = renderProfilGuruContent();
                break;
            case 'Jadwal Mengajar':
                headerTitle = "Jadwal Mengajar";
                headerIconHtml = '<i data-lucide="calendar" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addLesson()';
                contentHtml = renderJadwalMengajarContent();
                break;
            case 'Daftar Siswa':
                headerTitle = "Daftar Siswa";
                headerIconHtml = '<i data-lucide="users" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addStudent()';
                contentHtml = renderDaftarSiswaContent();
                break;
            case 'Daftar Hadir':
                headerTitle = "Daftar Hadir";
                headerIconHtml = '<i data-lucide="check-square" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addAttendance()';
                contentHtml = renderDaftarHadirContent();
                break;
            case 'Program Semester & Tahunan':
                headerTitle = "Program Semester & Tahunan";
                headerIconHtml = '<i data-lucide="book" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addProgramSemesterTahunan()';
                contentHtml = renderProgramSemesterTahunanContent();
                break;
            case 'Kalender Pendidikan':
                headerTitle = "Kalender Pendidikan";
                headerIconHtml = '<i data-lucide="calendar" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addCalendarEvent()';
                contentHtml = renderKalenderPendidikanContent();
                break;
            case 'Daftar Nilai':
                headerTitle = "Daftar Nilai";
                headerIconHtml = '<i data-lucide="clipboard-list" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addDaftarNilaiEntry()';
                contentHtml = renderDaftarNilaiContent();
                break;
            case 'Asesmen':
                headerTitle = "Asesmen";
                headerIconHtml = '<i data-lucide="target" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addAssessment()';
                contentHtml = renderAsesmenContent();
                break;
            case 'Modul Ajar':
                headerTitle = "Modul Ajar";
                headerIconHtml = '<i data-lucide="book" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addModulAjar()';
                showGlobalDownload = false; // Modul Ajar has individual download buttons
                contentHtml = renderModulAjarContent();
                break;
            case 'Riwayat Pelatihan':
                headerTitle = "Riwayat Pelatihan";
                headerIconHtml = '<i data-lucide="graduation-cap" style="width: 24px; height: 24px;"></i>';
                headerOnBack = 'Dashboard';
                headerOnAdd = 'addRiwayatPelatihan()';
                contentHtml = renderRiwayatPelatihanContent();
                break;
            default:
                headerTitle = "Dashboard";
                headerIconHtml = '<i data-lucide="layout-dashboard" style="width: 24px; height: 24px;"></i>';
                showGlobalDownload = false;
                contentHtml = renderDashboardContent();
                break;
        }

        mainContent.innerHTML = renderHeader(headerTitle, headerIconHtml, headerOnBack, headerOnAdd, showGlobalDownload) + contentHtml;
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons(); // Re-create icons for the newly injected HTML
        }
    }


    // --- Render Function ---
    function renderApp() {
        if (!isLoggedIn) {
            loginPage.style.display = 'flex';
            appContainer.style.display = 'none';
        } else {
            loginPage.style.display = 'none';
            appContainer.style.display = 'flex';

            // Update Header Info
            guruNameSpan.textContent = guruProfile.name;
            guruPhotoImg.src = guruProfile.photo;
            guruPhotoImg.onerror = function() { this.onerror=null; this.src='https://placehold.co/40x40/E0E7FF/4F46E5?text=G'; };
            guruPhotoImg.onclick = () => setActiveMenu('Profil Guru');

            renderPageContent(); // Call the centralized content renderer
        }

        // Render Modals
        if (messageModal.isOpen) {
            messageModalElem.style.display = 'flex';
            messageModalTitleElem.textContent = messageModal.title;
            messageModalMessageElem.textContent = messageModal.message;
        } else {
            messageModalElem.style.display = 'none';
        }

        if (dataModal.isOpen) {
            dataModalElem.style.display = 'flex';
            dataModalTitleElem.textContent = dataModal.title;
            dataModalFormElem.innerHTML = dataModal.formHtml;
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons(); // Re-create icons inside modal form
            }
        } else {
            dataModalElem.style.display = 'none';
        }

        if (confirmDeleteModal.isOpen) {
            confirmDeleteModalElem.style.display = 'flex';
            confirmDeleteModalMessageElem.textContent = confirmDeleteModal.message;
        } else {
            confirmDeleteModalElem.style.display = 'none';
        }
    }

    // --- Event Listeners Global ---
    loginButton.onclick = () => {
        isLoggedIn = true; // This will trigger onAuthStateChanged to fetch data
        renderApp();
    };

    logoutButton.onclick = async () => {
        try {
            await auth.signOut();
            isLoggedIn = false;
            activeMenu = 'Dashboard'; // Reset active menu on logout
            // Reset all loaded flags to false so data is re-fetched on next login/access
            studentsLoaded = false;
            scheduleLoaded = false;
            daftarHadirLoaded = false;
            programSemesterTahunanLoaded = false;
            kalenderPendidikanLoaded = false;
            daftarNilaiLoaded = false;
            asesmenLoaded = false;
            modulAjarLoaded = false;
            riwayatPelatihanLoaded = false;

            // Clear local data states (optional, as snapshots would repopulate)
            studentData = [];
            schedule = JSON.parse(JSON.stringify(initialSchedule));
            daftarHadir = [];
            programSemesterTahunan = [];
            kalenderPendidikan = [];
            daftarNilai = [];
            asesmen = [];
            modulAjar = [];
            riwayatPelatihan = [];

            renderApp();
            showMessage('Anda telah berhasil keluar.', 'Sesi Berakhir');
        } catch (error) {
            console.error("Error signing out:", error);
            showMessage(`Gagal keluar: ${error.message}`, 'Kesalahan');
        }
    };

    messageModalCloseButton.onclick = closeMessageModal;
    messageModalOkButton.onclick = closeMessageModal;

    dataModalCloseButton.onclick = closeDataModal;

    confirmDeleteModalCloseButton.onclick = closeConfirmDeleteModal;
    confirmDeleteModalCancelButton.onclick = closeConfirmDeleteModal;
    confirmDeleteModalConfirmButton.onclick = () => {
        if (confirmDeleteModal.onConfirm) {
            confirmDeleteModal.onConfirm();
        }
    };

    // Function to set active menu and re-render
    function setActiveMenu(menu) {
        activeMenu = menu;
        renderApp();
    }
    window.setActiveMenu = setActiveMenu; // Expose to global scope for onclick attributes

    // Initial render on page load, will be handled by onAuthStateChanged
    loadingOverlay.style.display = 'flex'; // Show loading on initial load
});
