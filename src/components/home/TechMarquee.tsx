import { Link } from 'react-router-dom'

interface TechBrand {
    name: string
    color: string
    iconSvg: string
}

const TECH_ROW_1: TechBrand[] = [
    {
        name: 'JavaScript',
        color: '#f7df1e',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#f7df1e" d="M3 3h18v18H3V3z"/><path fill="#000000" d="M12 18.5c-.8 0-1.5-.2-2-.6l.7-1.4c.4.3.9.5 1.4.5.6 0 1-.3 1-.7 0-.5-.4-.7-1.1-.9l-.4-.1c-1.3-.4-1.9-1.1-1.9-2.1 0-1.4 1.1-2.3 2.6-2.3.8 0 1.5.2 1.9.5l-.6 1.4c-.3-.2-.8-.4-1.3-.4-.6 0-1 .3-1 .7 0 .4.4.6 1 .9l.4.1c1.4.5 2 1.1 2 2.2 0 1.5-1.1 2.3-2.7 2.3zm6.5-.1c-.9 0-1.6-.4-2-.9l.9-1.2c.3.4.7.7 1.2.7.5 0 .8-.2.8-.6V11h1.6v5.4c0 1.3-.9 2-2.5 2z"/></svg>'
    },
    {
        name: 'TypeScript',
        color: '#3178c6',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#3178c6" d="M3 3h18v18H3V3z"/><path fill="#ffffff" d="M7 8h6v2h-2v7H9v-7H7V8zm8.5 4.5c.8 0 1.4.3 1.7.6l.8-1.4c-.6-.5-1.5-.8-2.5-.8-2 0-3.3 1.2-3.3 3.1 0 1.9 1.3 2.7 2.7 3.2l.4.1c.9.3 1.3.6 1.3 1.2 0 .6-.5 1-1.4 1-.9 0-1.7-.4-2.1-.8l-.8 1.4c.7.6 1.7.9 2.9.9 2.2 0 3.5-1.2 3.5-3.2 0-1.7-1.1-2.6-2.5-3.1l-.4-.1c-.8-.3-1.4-.6-1.4-1.2 0-.6.5-1 1.2-1z"/></svg>'
    },
    {
        name: 'React',
        color: '#61dafb',
        iconSvg: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="4" ry="10.5" fill="none" stroke="#61dafb" stroke-width="1.6" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="4" ry="10.5" fill="none" stroke="#61dafb" stroke-width="1.6" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="4" ry="10.5" fill="none" stroke="#61dafb" stroke-width="1.6" transform="rotate(150 12 12)"/><circle cx="12" cy="12" r="2" fill="#61dafb"/></svg>'
    },
    {
        name: 'Python',
        color: '#3776ab',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#3776ab" d="M11.9 2c-4.4 0-4.1 1.9-4.1 1.9l.01 2h4.2v.6H6.3s-2.8.3-2.8 4.2c0 3.8 2.5 4 2.5 4h1.5v-2.1s-.1-2.5 2.5-2.5h4.2s2.4-.1 2.4-2.4V4.4s.4-2.4-4.7-2.4zm-1.3 1.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z"/><path fill="#ffd43b" d="M12.1 22c4.4 0 4.1-1.9 4.1-1.9l-.01-2h-4.2v-.6h5.7s2.8-.3 2.8-4.2c0-3.8-2.5-4-2.5-4h-1.5v2.1s.1 2.5-2.5 2.5H9.8s-2.4.1-2.4 2.4v3.3s-.4 2.4 4.7 2.4zm1.3-1.2a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"/></svg>'
    },
    {
        name: 'Java',
        color: '#ea2d2e',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#ea2d2e" d="M8.8 17.5s-1.8.4.2 1.3c2.4 1.1 5.3 1.2 7.7.3 0 0 1.1-.5.3-1-1.1-.7-3.7-.8-5.3-.9-1.2-.1-2.9.3-2.9.3zm-1.1-2.6c3.2.7 6.4.7 9.5-.2 0 0 .9-.3.3-.8-.9-.6-2.8-.7-4.2-.7-2.3 0-4.2.3-5.6 1.7zm10.7 4.8c-2.9 1.4-7.5 1.5-10.7.3-1.5-.6-2.5-1.5-1.2-2.1 0 0 .8-.4 1.8-.4-1-.7-.6-1.5-.6-1.5 2.8.9 5.8 1 8.8.4 2.3-.5 4.5-1.5 4.5-1.5s1.2.7-.2 1.5c-1.4.9-3.4 1.3-5.2 1.5 3.3.4 6.7-.4 6.7-.4s.9.7-3.9 1.7z"/><path fill="#5382a1" d="M13.4 2s2.5 2.5-2.4 6.3c-3.9 3.1-.9 4.9-.9 4.9s-2.5-1.9.9-4.9c3.9-3.4 2.4-6.3 2.4-6.3zm3.1 3.2s2.1 2.1-2 5.3c-3.3 2.6-.7 4.1-.7 4.1s-2.1-1.6.7-4.1c3.3-2.9 2-5.3 2-5.3z"/></svg>'
    },
    {
        name: 'Node.js',
        color: '#539e43',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#539e43" d="M12 2.2l8.5 4.9v9.8L12 21.8 3.5 16.9V7.1L12 2.2zm0 2.3L5.5 8v8l6.5 3.8 6.5-3.8V8L12 4.5zm0 3.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/></svg>'
    },
    {
        name: 'Next.js',
        color: '#000000',
        iconSvg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#000000"/><path fill="#ffffff" d="M15.5 8h1.8v8h-1.8V8zm-6.7 8L15.3 8.3c-.3-.2-.7-.3-1.1-.3H8.8v8h1.8v-5.2l4.8 5.5c.3-.1.6-.2.9-.3L8.8 8v8z"/></svg>'
    },
    {
        name: 'PHP',
        color: '#777bb4',
        iconSvg: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="11" ry="6.5" fill="#777bb4"/><path fill="#ffffff" d="M6.2 9.5h2.2c1.2 0 1.8.5 1.6 1.5-.2 1.1-.9 1.5-2.1 1.5h-1l-.7 2H5l1.2-5zm1.7 2c.5 0 .8-.2.9-.6.1-.4 0-.6-.5-.6h-.8l-.3 1.2h.7zm4.7-2h1.2l-.4 1.8h1.5l.4-1.8h1.2l-1.2 5h-1.2l.5-2.2H13l-.5 2.2h-1.2l1.3-5zm6.5 0h2.2c1.2 0 1.8.5 1.6 1.5-.2 1.1-.9 1.5-2.1 1.5h-1l-.7 2H18l1.1-5zm1.7 2c.5 0 .8-.2.9-.6.1-.4 0-.6-.5-.6h-.8l-.3 1.2h.7z"/></svg>'
    },
    {
        name: 'Vue.js',
        color: '#42b883',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#42b883" d="M2 3h3.5L12 14.2 18.5 3H22L12 21 2 3z"/><path fill="#35495e" d="M6.5 3h3.3L12 7.1 14.2 3h3.3L12 12.8 6.5 3z"/></svg>'
    },
    {
        name: 'Flutter',
        color: '#02569b',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#02569b" d="M14.3 2L4 12.3l3.2 3.2L20.7 2h-6.4zm0 8.7L8.9 16.1l3.2 3.2 5.4-5.4 3.2 3.2-3.2 3.2L14.3 22h6.4l3.2-3.2-5.4-5.4 5.4-5.4h-6.4l-3.2 3.2z"/></svg>'
    }
]

const TECH_ROW_2: TechBrand[] = [
    {
        name: 'Laravel',
        color: '#ff2d20',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#ff2d20" d="M19.4 6.6L12 2.3 4.6 6.6v8.7l7.4 4.3 7.4-4.3V6.6zm-1.8 7.6l-5.6 3.2-5.6-3.2V8.2l5.6-3.2 5.6 3.2v6z"/></svg>'
    },
    {
        name: 'C# / .NET',
        color: '#512bd4',
        iconSvg: '<svg viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="4" fill="#512bd4"/><path fill="#ffffff" d="M7 8a4 4 0 1 0 0 8c1.5 0 2.5-.7 3-1.5l-1.3-.9c-.4.5-1 .9-1.7.9a2.5 2.5 0 0 1 0-5c.7 0 1.3.4 1.7.9l1.3-.9C9.5 8.7 8.5 8 7 8zm7.5 1h1.5v2h2v1.5h-2v2h2V16h-2v2h-1.5v-2h-2v-1.5h2v-2h-2V11h2V9z"/></svg>'
    },
    {
        name: 'C++',
        color: '#00599c',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#00599c" d="M12 2.5l8.2 4.7v9.5L12 21.4 3.8 16.7V7.2L12 2.5zm-3 6.8a3.7 3.7 0 1 0 0 5.4c1 .8 2.2 1 3.2.6l-.4-1.2c-.7.2-1.5 0-2.1-.5a2.5 2.5 0 0 1 0-3.6c.6-.5 1.4-.7 2.1-.5l.4-1.2c-1-.4-2.2-.2-3.2.6zm6.5 1.2h.9v1.2h1.2v.9h-1.2v1.2h-.9v-1.2h-1.2v-.9h1.2v-1.2zm3.3 0h.9v1.2h1.2v.9h-1.2v1.2h-.9v-1.2h-1.2v-.9h1.2v-1.2z"/></svg>'
    },
    {
        name: 'Spring Boot',
        color: '#6db33f',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#6db33f" d="M12 2.2a9.8 9.8 0 1 0 9.8 9.8A9.8 9.8 0 0 0 12 2.2zm-1.2 5.5a1.2 1.2 0 1 1 2.4 0v6.1a1.2 1.2 0 1 1-2.4 0zm1.2 11a6.1 6.1 0 0 1-4.3-10.4l1.7 1.7a3.7 3.7 0 1 0 5.2 0l1.7-1.7a6.1 6.1 0 0 1-4.3 10.4z"/></svg>'
    },
    {
        name: 'Golang',
        color: '#00add8',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#00add8" d="M12 3a9 9 0 0 0-9 9c0 5 4 9 9 9 4.2 0 7.8-2.9 8.7-7H12v-3h11c0 5.5-4.5 10-10 10-5.5 0-10-4.5-10-10S7.5 2 13 2c3.1 0 6 1.5 7.8 4l-2.4 1.8C17 6.1 14.8 5 13 5z"/></svg>'
    },
    {
        name: 'MySQL',
        color: '#4479a1',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#4479a1" d="M12 3C7 3 3 5 3 7.5S7 12 12 12s9-2 9-4.5S17 3 12 3zm0 6c-3.9 0-7-1.1-7-2.5S8.1 4 12 4s7 1.1 7 2.5S15.9 9 12 9zm-9 1v3.5C3 16 7 18 12 18s9-2 9-4.5V10c-2.1 1.5-5.3 2.5-9 2.5S5.1 11.5 3 10zm0 5.5V19C3 21.5 7 23.5 12 23.5s9-2 9-4.5v-3.5c-2.1 1.5-5.3 2.5-9 2.5s-6.9-1-9-2.5z"/></svg>'
    },
    {
        name: 'MongoDB',
        color: '#47a248',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#47a248" d="M12 1.5s-7 6.4-7 12.3c0 4.6 3.1 8.7 7 8.7s7-4.1 7-8.7c0-5.9-7-12.3-7-12.3zm-.8 18.5V14l-2-2c0 3.7 2 6.5 2 8zm1.6 0c0-1.5 2-4.3 2-8l-2 2v6z"/></svg>'
    },
    {
        name: 'Kotlin',
        color: '#7f52ff',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#7f52ff" d="M2 2h20L12 12l10 10H2V2zm0 10l10 10H2V12z"/></svg>'
    },
    {
        name: 'Swift',
        color: '#f05138',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#f05138" d="M21.5 14.8c-.8 2.2-2.3 4.2-4.2 5.5-3.3 2.3-7.7 2.2-10.8-.2 3.8-.5 7.1-2.5 9-5.7-2.8.2-5.4-.8-7.3-2.6 1.8-.1 3.5-.7 4.9-1.8-2.6-.4-4.8-2.1-5.7-4.5 1.5.1 3-.2 4.3-.9-3-1.2-4.9-4-4.8-7.1 2.2 2.3 5 3.9 8.1 4.7 1.4-1.2 2.7-2.7 3.8-4.4-.3 1.9-.9 3.7-1.9 5.3 1.9-.4 3.7-1.3 5.3-2.5-1 1.7-2.3 3.1-3.9 4.2 2.1-.2 4.1-.9 5.9-1.9-1.1 1.9-2.6 3.5-4.4 4.7 2.6.2 4.9-.7 6.8-2.2-.6 3.1-2.4 5.9-5.1 7.4z"/></svg>'
    },
    {
        name: 'Tailwind CSS',
        color: '#06b6d4',
        iconSvg: '<svg viewBox="0 0 24 24"><path fill="#06b6d4" d="M12 6c-3.3 0-5.3 1.7-6 5 1.3-1.7 2.9-2.3 4.7-1.7 1 0.4 1.8 1.2 2.6 2 1.3 1.4 2.9 3 6.7 3 3.3 0 5.3-1.7 6-5-1.3 1.7-2.9 2.3-4.7 1.7-1-0.4-1.8-1.2-2.6-2-1.3-1.4-2.9-3-6.7-3zm-6 6c-3.3 0-5.3 1.7-6 5 1.3-1.7 2.9-2.3 4.7-1.7 1 0.4 1.8 1.2 2.6 2 1.3 1.4 2.9 3 6.7 3 3.3 0 5.3-1.7 6-5-1.3 1.7-2.9 2.3-4.7 1.7-1-0.4-1.8-1.2-2.6-2-1.3-1.4-2.9-3-6.7-3z"/></svg>'
    }
]

export function TechMarquee() {
    return (
        <section className="tech-marquee-section">
            <div className="home-section__heading tech-marquee-heading">
                <div>
                    <span className="home-section__eyebrow">CÔNG NGHỆ NỔI BẬT</span>
                    <h2>Ngôn ngữ &amp; Công nghệ <span>hàng đầu</span></h2>
                </div>
                <Link className="home-category-all" to="/products">
                    Tất cả công nghệ <span aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="marquee-wrapper">
                <div className="marquee-track marquee-track--to-left">
                    {[...TECH_ROW_1, ...TECH_ROW_1, ...TECH_ROW_1].map((tech, idx) => (
                        <Link
                            to={`/products?tech=${encodeURIComponent(tech.name)}`}
                            key={`row1-${tech.name}-${idx}`}
                            className="tech-badge-pill"
                        >
                            <span
                                className="tech-badge-pill__icon"
                                dangerouslySetInnerHTML={{ __html: tech.iconSvg }}
                            />
                            <span className="tech-badge-pill__name">{tech.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="marquee-track marquee-track--to-right">
                    {[...TECH_ROW_2, ...TECH_ROW_2, ...TECH_ROW_2].map((tech, idx) => (
                        <Link
                            to={`/products?tech=${encodeURIComponent(tech.name)}`}
                            key={`row2-${tech.name}-${idx}`}
                            className="tech-badge-pill"
                        >
                            <span
                                className="tech-badge-pill__icon"
                                dangerouslySetInnerHTML={{ __html: tech.iconSvg }}
                            />
                            <span className="tech-badge-pill__name">{tech.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TechMarquee
