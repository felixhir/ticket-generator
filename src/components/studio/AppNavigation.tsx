'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppSurface, SegmentedControl } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Locale } from '@/lib/i18n/routing'
import { getLocalizedPath, supportedLanguages } from '@/lib/i18n/routing'

export type StudioPage = 'create' | 'stored' | 'ticket'

export default function AppNavigation({
    activePage,
    currentPath,
    locale
}: {
    activePage: StudioPage
    currentPath: string
    locale: Locale
}) {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation()
    const isStoredArea = activePage === 'stored' || activePage === 'ticket'

    return (
        <nav className='relative flex items-center gap-app-card'>
            <Button
                type='button'
                aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                aria-expanded={isOpen}
                variant='outline'
                size='icon-lg'
                className='sm:hidden'
                onClick={() => setIsOpen(open => !open)}
            >
                {isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
            </Button>

            <SegmentedControl className='hidden sm:flex'>
                <NavigationLink href={getLocalizedPath(locale, '/create')} active={activePage === 'create'}>
                    {t('nav.create')}
                </NavigationLink>
                <NavigationLink href={getLocalizedPath(locale, '/stored')} active={isStoredArea}>
                    {t('nav.stored')}
                </NavigationLink>
            </SegmentedControl>
            <SegmentedControl className='hidden sm:flex'>
                <LanguageSelect currentPath={currentPath} locale={locale} />
                <Button asChild variant='ghost' size='icon-lg'>
                    <a
                        href='https://github.com/felixhir/ticket-generator'
                        target='_blank'
                        rel='noreferrer'
                        aria-label={t('nav.github')}
                        title={t('nav.github')}
                    >
                        <Image src='/github.svg' alt='' width={16} height={16} className='rounded-full invert' />
                    </a>
                </Button>
            </SegmentedControl>

            {isOpen && (
                <AppSurface
                    variant='elevated'
                    padding='none'
                    className='absolute top-full right-0 z-20 mt-app-menu-offset grid min-w-48 gap-1 p-2 sm:hidden'
                >
                    <MobileNavigationLink
                        href={getLocalizedPath(locale, '/create')}
                        active={activePage === 'create'}
                        onNavigate={() => setIsOpen(false)}
                    >
                        {t('nav.create')}
                    </MobileNavigationLink>
                    <MobileNavigationLink
                        href={getLocalizedPath(locale, '/stored')}
                        active={isStoredArea}
                        onNavigate={() => setIsOpen(false)}
                    >
                        {t('nav.stored')}
                    </MobileNavigationLink>
                    <LanguageSelect
                        currentPath={currentPath}
                        className='w-full justify-self-start rounded-app-card bg-transparent py-app-control-y text-left'
                        locale={locale}
                        onNavigate={() => setIsOpen(false)}
                    />
                    <Button asChild variant='ghost' className='justify-start rounded-app-card'>
                        <a
                            href='https://github.com/felixhir/ticket-generator'
                            target='_blank'
                            rel='noreferrer'
                            aria-label={t('nav.github')}
                            onClick={() => setIsOpen(false)}
                        >
                            <Image src='/github.svg' alt='' width={16} height={16} className='rounded-full invert' />
                            GitHub
                        </a>
                    </Button>
                </AppSurface>
            )}
        </nav>
    )
}

function LanguageSelect({
    className = '',
    currentPath,
    locale,
    onNavigate
}: {
    className?: string
    currentPath: string
    locale: Locale
    onNavigate?: () => void
}) {
    const router = useRouter()

    return (
        <Select
            value={locale}
            onValueChange={value => {
                if (value !== locale) {
                    onNavigate?.()
                    router.push(getLocalizedPath(value as Locale, currentPath))
                }
            }}
        >
            <SelectTrigger
                aria-label='Language'
                size='sm'
                className={`h-app-nav-control min-w-20 rounded-app-control border-0 bg-transparent font-medium uppercase text-app-text-secondary hover:bg-app-surface-elevated hover:text-app-text-primary ${className}`}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent align='end'>
                {supportedLanguages.map(language => (
                    <SelectItem key={language} value={language} className='uppercase'>
                        {language.toUpperCase()}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function NavigationLink({ active, children, href }: { active: boolean; children: ReactNode; href: string }) {
    return (
        <Button asChild variant={active ? 'default' : 'ghost'} className='h-app-nav-control'>
            <Link href={href} aria-current={active ? 'page' : undefined}>
                {children}
            </Link>
        </Button>
    )
}

function MobileNavigationLink({
    active,
    children,
    href,
    onNavigate
}: {
    active: boolean
    children: ReactNode
    href: string
    onNavigate: () => void
}) {
    return (
        <Button asChild variant={active ? 'default' : 'ghost'} className='justify-start rounded-app-card'>
            <Link href={href} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
                {children}
            </Link>
        </Button>
    )
}
