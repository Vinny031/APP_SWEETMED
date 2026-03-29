/**
 * Plugin Font Awesome 6 — configuration globale pour Vue 3
 * On importe uniquement les icônes utilisées (tree-shaking).
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faHouse,
  faCompass,
  faHeart,
  faUser,
  faMagnifyingGlass,
  faXmark,
  faBell,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faArrowRight,
  faLeaf,
  faCircleCheck,
  faListOl,
  faTriangleExclamation,
  faBolt,
  faWandMagicSparkles,
  faRotateLeft,
  faFloppyDisk,
  faTrash,
  faBookOpen,
  faClock,
  // Auth + Admin
  faShieldHalved,
  faPlus,
  faPen,
  faRightFromBracket,
  faLock,
  faEnvelope,
  faChartBar,
  faEye,
  faEyeSlash,
  faGear,
  faTags,
  faImage,
  faArrowUpFromBracket,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faHouse, faCompass, faHeart, faUser,
  faMagnifyingGlass, faXmark, faBell,
  faChevronLeft, faChevronRight, faChevronDown, faArrowRight,
  faLeaf, faCircleCheck, faListOl, faTriangleExclamation,
  faBolt, faWandMagicSparkles, faRotateLeft, faFloppyDisk,
  faTrash, faBookOpen, faClock,
  // Auth + Admin
  faShieldHalved, faPlus, faPen, faRightFromBracket,
  faLock, faEnvelope, faChartBar, faEye, faEyeSlash, faGear,
  faTags, faImage, faArrowUpFromBracket,
)

export { FontAwesomeIcon }
