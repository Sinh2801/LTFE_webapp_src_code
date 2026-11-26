import type { ReactNode } from 'react'
import sourceCodeLogo from '../../assets/sourcecode-logo.png'
import { CheckIcon } from './Icons'

interface AuthShellProps {
    title: string
    text: string
    items: string[]
    children: ReactNode
}

function AuthShell({ title, text, items, children }: AuthShellProps) {
    return (
        <div className="auth-wrap">
            <section className="auth-shell">
                <aside className="auth-aside">
                    <div className="auth-aside__brand">
                        <span className="auth-aside__logo"><img src={sourceCodeLogo} alt="" /></span>
                        <strong>SourceCodeTST</strong>
                    </div>
                    <div className="auth-aside__body">
                        <h2>{title}</h2>
                        <p>{text}</p>
                    </div>
                    <ul className="auth-aside__list">
                        {items.map((item) => (
                            <li key={item}><span className="auth-aside__tick"><CheckIcon size={14} /></span>{item}</li>
                        ))}
                    </ul>
                </aside>
                <div className="auth-main">{children}</div>
            </section>
        </div>
    )
}

export default AuthShell
