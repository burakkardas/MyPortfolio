/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const setActiveLink = sectionId =>{
    document.querySelectorAll('.nav__menu .nav__link').forEach(link =>{
        link.classList.toggle('active-link', link.getAttribute('href') === '#' + sectionId)
    })
}

const scrollActive = () =>{
    const headerHeight = document.querySelector('.l-header').offsetHeight,
          scrollDown = window.scrollY + headerHeight + 1,
          atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

    // The last section is too short to reach the top, so select it at the bottom of the page
    let activeId = sections[0].id
    if(atBottom){
        activeId = sections[sections.length - 1].id
    }else{
        sections.forEach(current =>{
            if(scrollDown >= current.offsetTop) activeId = current.id
        })
    }
    setActiveLink(activeId)
}
window.addEventListener('scroll', scrollActive)
window.addEventListener('load', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .experience__subtitle',{}); 
sr.reveal('.about__subtitle, .about__text',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.experience__card, .work__img, .contact__link',{interval: 200}); 
