import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import GalleryRootstock from "./components/GalleryRootstock";
import GalleryOrdinals from "./components/GalleryOrdinals";
import GalleryStacks from "./components/GalleryStacks";

function App() {
    return (
        <Routes>
            <Route path={"/gallery-stacks"} element={<GalleryStacks/>}/>
            <Route path={"/gallery-ordinals"} element={<GalleryOrdinals/>}/>
            <Route path={"/gallery-rootstock"} element={<GalleryRootstock/>}/>
            <Route path="/" element={<Home/>}/>
        </Routes>
    )
}

export default App

