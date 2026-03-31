export const useSiteData = () => {
  const nav = [
    { label: 'Home',     to: '/'        },
    { label: 'About',    to: '/about'   },
    { label: 'Services', to: '/services'},
    { label: 'Blog',     to: '/blog'    },
    { label: 'Shop',     to: '/shop'    },
    { label: 'Contact',  to: '/contact' },
  ]

  const footerServices = [
    'Nutrition Consultation',
    'Meal Planning',
    'Weight Management',
    'Sports Nutrition',
    'Wellness Programs',
  ]

  const footerLinks = [
    { label: 'Home',     to: '/'        },
    { label: 'About',    to: '/about'   },
    { label: 'Services', to: '/services'},
    { label: 'Blog',     to: '/blog'    },
    { label: 'Shop',     to: '/shop'    },
    { label: 'Contact',  to: '/contact' },
  ]

  const socials = [
    { label: 'Facebook',   href: '#', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` },
    { label: 'Instagram',  href: '#', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>` },
    { label: 'Twitter',    href: '#', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
    { label: 'LinkedIn',   href: '#', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` },
  ]

  const contactInfo = {
    address: 'Nairobi, Kenya',
    area:    'Westlands Area',
    phones:  ['+254 700 123 456', '+254 720 987 654'],
    emails:  ['info@swmnutrition.co.ke', 'consult@swmnutrition.co.ke'],
    hours:   'Mon – Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 2:00 PM',
  }

  return { nav, footerLinks, footerServices, socials, contactInfo }
}
