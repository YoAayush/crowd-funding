// import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

import { CgProfile } from "react-icons/cg";
import { MdCreateNewFolder, MdDashboard } from "react-icons/md";

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: MdDashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: MdCreateNewFolder,
    link: '/create-campaign',
  },
  // {
  //   name: 'payment',
  //   imgUrl: payment,
  //   link: '/',
  //   disabled: true,
  // },
  // {
  //   name: 'withdraw',
  //   imgUrl: withdraw,
  //   link: '/',
  //   disabled: true,
  // },
  {
    name: 'profile',
    imgUrl: CgProfile,
    link: '/profile',
  },
  // {
  //   name: 'logout',
  //   imgUrl: logout,
  //   link: '/',
  //   disabled: true,
  // },
];
