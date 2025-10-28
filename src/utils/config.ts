import { CpuIcon, CalculatorIcon, FlaskRoundIcon } from "lucide-react";

// TODO: Use localStorage
export const ROWS = 30
export const COLS = 30
export const CELL_SIZE = 50

export const WEBSITE_URL = "/smart-lab";

export const WEB_PAGE = [
  {
    id: 'algo-works',
    icon: CpuIcon,
    path: `${WEBSITE_URL}/algo-works`,
    title: 'Algo Works',
    description: 'Visualisasikan cara kerja algoritma secara interaktif.',
    color: '#007bff',
    delay: '0s'
  },
  {
    id: 'calc-forge',
    path: `${WEBSITE_URL}/calc-forge`,
    icon: CalculatorIcon,
    title: 'Calc Forge',
    description: 'Hitung rumus ilmiah dengan cepat dan akurat.',
    color: '#28a745',
    delay: '0.5s'
  },
  {
    id: 'ar-lab',
    icon: FlaskRoundIcon,
    title: 'AR Lab',
    path: `${WEBSITE_URL}/ar-lab`,
    description: 'Ukur objek di dunia nyata menggunakan kamera Anda.',
    color: '#ffc107',
    delay: '1s'
  },
]

