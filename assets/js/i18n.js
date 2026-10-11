/*===== LANGUAGE =====*/
// Turkish is the default and lives in index.html; this file only holds the English texts.
const translations = {
    en: {
        'meta.title': 'Burak | Game Developer',
        'meta.description': 'Portfolio of Burak Kardaş, a Unity game developer: games, Swift and Flutter projects.',

        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.experience': 'Experience',
        'nav.work': 'Work',
        'nav.contact': 'Contact',

        'home.title': 'Hi,<br>I\'m <span class="home__title-color">Burak</span><br> Game Developer',
        'home.contact': 'Contact',
        'cv.download': 'Download CV',

        'about.role': 'Game Developer · Unity',
        'about.subtitle': 'Hi, I\'m Burak.',
        'about.p1': 'I\'m a game developer who loves turning simple ideas into games people can\'t put down. Most of my work is in Unity, where I\'ve built and shipped casual and hyper-casual titles on the App Store and Google Play, as well as No Surrender Heroes on Steam.',
        'about.p2': 'At No Surrender Studio I designed and developed game levels and polished many parts of our casual games. At Lagot Games I took hyper-casual projects from first prototype to release, setting up the software architecture, applying design patterns and optimizing performance so the games run smoothly on every device.',
        'about.p3': 'My background in graphic design helps me care about how a game looks and feels, not just how it works. Alongside games I also build mobile apps with Swift and Flutter, but making games is what I enjoy most.',

        'exp.work': 'Work Experience',
        'exp.education': 'Education',
        'exp.gamedev': 'Game Developer',
        'exp.designer': 'Graphic Designer',
        'exp.avrasya.company': 'Avrasya University',
        'exp.nss.text': 'At No Surrender Studio, we focus on developing casual games and I have been involved in developing various game levels. Throughout this experience, I have contributed to different stages of the game development process and put effort into enhancing various sections of the games. This experience has helped me to expand my knowledge and skills in the field of casual game development.',
        'exp.lagot.text': 'At Lagot Games, I had the opportunity to work on various Hyper Casual games where I contributed to the development process from inception to release. My responsibilities included implementing software architectures, optimizing game performance, and applying design patterns to ensure efficient and maintainable code. This experience allowed me to deepen my understanding of game development principles and refine my skills in software engineering, optimization techniques, and design patterns.',
        'exp.avrasya.text': 'I worked as a graphic designer at Avrasya University, where I had the opportunity to apply my creativity and design skills. I was responsible for creating visually appealing materials for various university projects and events. This role allowed me to hone my graphic design abilities while collaborating with a diverse team to meet the university\'s communication needs.',
        'edu.mersin.title': 'Information Systems and Technologies',
        'edu.mersin.school': 'Mersin University',
        'edu.ktu.title': 'Computer Programming',
        'edu.ktu.school': 'Karadeniz Technical University',

        'work.game': 'Games',
    },
    tr: {}
}

const langToggle = document.getElementById('lang-toggle'),
      i18nTexts = document.querySelectorAll('[data-i18n]'),
      i18nContents = document.querySelectorAll('[data-i18n-content]')

// Read the Turkish texts from the page so they are only written once
i18nTexts.forEach(el => translations.tr[el.dataset.i18n] = el.innerHTML)
i18nContents.forEach(el => translations.tr[el.dataset.i18nContent] = el.getAttribute('content'))

const setLanguage = lang =>{
    const dict = translations[lang]

    i18nTexts.forEach(el =>{
        const text = dict[el.dataset.i18n]
        if(text !== undefined) el.innerHTML = text
    })
    i18nContents.forEach(el =>{
        const text = dict[el.dataset.i18nContent]
        if(text !== undefined) el.setAttribute('content', text)
    })

    document.documentElement.lang = lang
    langToggle.textContent = lang === 'tr' ? 'EN' : 'TR'
    langToggle.setAttribute('aria-label', lang === 'tr' ? 'Switch to English' : 'Türkçeye geç')

    try{ localStorage.setItem('lang', lang) }catch(e){}
}

let savedLang = null
try{ savedLang = localStorage.getItem('lang') }catch(e){}
if(savedLang === 'en') setLanguage('en')

langToggle.addEventListener('click', ()=>{
    setLanguage(document.documentElement.lang === 'tr' ? 'en' : 'tr')
})
