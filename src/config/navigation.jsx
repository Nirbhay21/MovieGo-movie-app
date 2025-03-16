import { FaHome } from "react-icons/fa";
import { IoTvSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { BiSolidMoviePlay } from "react-icons/bi";

export const navigation = [
    {
        label: "Movies",
        href: "movie",
        icon: <BiSolidMoviePlay />
    },
    {
        label: "TV Shows",
        href: "tv",
        icon: <IoTvSharp />
    }
];

export const mobileNavigation = [
    {
        label: "Home",
        href: "/",
        icon: <FaHome />
    },
    ...navigation,
    {
        label: "Search",
        href: "search",
        icon: <IoIosSearch />
    }
]
