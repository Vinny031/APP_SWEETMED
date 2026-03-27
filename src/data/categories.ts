/**
 * Données mock — Catégories de médecine douce
 * Source locale, pas de backend requis.
 */
import type { Categorie } from '@/types'

// BASE_URL = '/' en dev, '/APP_SWEETMED/' en prod (GitHub Pages)
const base = import.meta.env.BASE_URL

export const categories: Categorie[] = [
  {
    id: 'aromatherapie',
    nom: 'Aromathérapie',
    description: 'Bienfaits des huiles essentielles pour le corps et l\'esprit',
    couleur: 'bg-mint-100',
    couleurTexte: 'text-mint-800',
    icone: 'leaf',
    emoji: '🌿',
    image: `${base}icons/icon_arom.webp`,
  },
  {
    id: 'phytotherapie',
    nom: 'Phytothérapie',
    description: 'Plantes médicinales et tisanes thérapeutiques',
    couleur: 'bg-soleil-100',
    couleurTexte: 'text-soleil-700',
    icone: 'seedling',
    emoji: '🌱',
    image: `${base}icons/icon_phyto.webp`,
  },
  {
    id: 'sophrologie',
    nom: 'Sophrologie',
    description: 'Techniques de relaxation et harmonisation corps-esprit',
    couleur: 'bg-lavande-100',
    couleurTexte: 'text-lavande-700',
    icone: 'brain',
    emoji: '🧘',
    image: `${base}icons/icon_sophro.webp`,
  },
  {
    id: 'acupression',
    nom: 'Acupression',
    description: 'Points de pression pour soulager douleurs et tensions',
    couleur: 'bg-peche-100',
    couleurTexte: 'text-peche-700',
    icone: 'hand',
    emoji: '👐',
    image: `${base}icons/icon_acup.webp`,
  },
  {
    id: 'nutrition',
    nom: 'Nutrition Douce',
    description: 'Alimentation équilibrée et remèdes alimentaires naturels',
    couleur: 'bg-mint-100',
    couleurTexte: 'text-mint-700',
    icone: 'apple-whole',
    emoji: '🥗',
    image: `${base}icons/icon_food.webp`,
  },
  {
    id: 'meditation',
    nom: 'Méditation',
    description: 'Pleine conscience et pratiques de méditation guidée',
    couleur: 'bg-lavande-100',
    couleurTexte: 'text-lavande-600',
    icone: 'water',
    emoji: '☮️',
    image: `${base}icons/icon_medit.webp`,
  },
  {
    id: 'ayurveda',
    nom: 'Ayurvéda',
    description: 'Médecine traditionnelle indienne et équilibre des doshas',
    couleur: 'bg-soleil-100',
    couleurTexte: 'text-soleil-600',
    icone: 'sun',
    emoji: '☀️',
  },
  {
    id: 'homeopathie',
    nom: 'Homéopathie',
    description: 'Remèdes homéopathiques doux pour toute la famille',
    couleur: 'bg-peche-50',
    couleurTexte: 'text-peche-600',
    icone: 'droplet',
    emoji: '💧',
  },
]
