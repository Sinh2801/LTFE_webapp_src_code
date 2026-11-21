import { formatDate } from '../../libs/format'
import type { User } from '../../libs/types'

interface Stat {
    label: string
    value: number
}

function ProfileHero({ user, stats }: { user: User; stats: Stat[] }) {
    return (
        <section className="acct-hero">
            <div className="acct-hero__who">
                <span className="acct-hero__avatar" aria-hidden="true">{user.fullName.charAt(0).toUpperCase()}</span>
                <div>
                    <span className="home-section__eyebrow acct-hero__eyebrow">TÀI KHOẢN CỦA TÔI</span>
                    <h1>{user.fullName}</h1>
                    <p>{user.email} · Thành viên từ {formatDate(user.createdAt)}</p>
                </div>
            </div>
            <ul className="acct-hero__stats">
                {stats.map((stat) => (
                    <li key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></li>
                ))}
            </ul>
        </section>
    )
}

export default ProfileHero
