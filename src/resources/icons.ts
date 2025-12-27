import { IconType } from "react-icons";

import {
  HiArrowUpRight,
  HiOutlineLink,
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCalendarDays,
  HiArrowRight,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineDocument,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineMagnifyingGlass,
  HiOutlineBookmark,
  HiOutlineChartBar,
  HiOutlineHome,
  HiOutlineCog6Tooth,
  HiOutlineUser,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBars3,
  HiXMark,
} from "react-icons/hi2";

import { FaGithub, FaLinkedin, FaX } from "react-icons/fa6";

export const iconLibrary: Record<string, IconType> = {
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaX,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  search: HiOutlineMagnifyingGlass,
  bookmark: HiOutlineBookmark,
  chart: HiOutlineChartBar,
  home: HiOutlineHome,
  settings: HiOutlineCog6Tooth,
  user: HiOutlineUser,
  sun: HiOutlineSun,
  moon: HiOutlineMoon,
  menu: HiOutlineBars3,
  close: HiXMark,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
