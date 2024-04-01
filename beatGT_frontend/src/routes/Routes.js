import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Login from "../pages/login/Login";
import Registration from "../pages/registration/Registration";
import Component from "../pages/pc_component/Component";
import NotFound from "../pages/not_found/NotFound";
import { ComponentLoader } from "../pages/pc_component/Component";
import Assembly from "../pages/assembly/Assembly";
import { AssemblyLoader } from "../pages/assembly/Assembly";
import CreateComponent from "../pages/create_pc_component/CreateComponent";
import Home from "../pages/home/Home";
import CreateAssembly from "../pages/create_assembly/CreateAssembly";

export default function AppRouter() {

    const router = createBrowserRouter(createRoutesFromElements(
        <>
            <Route index path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/component" element={<Component />} errorElement={<NotFound>Комплектующее не найдено!</NotFound>} loader={ComponentLoader} />
            <Route path="/assembly" element={<Assembly />} errorElement={<NotFound>Сборка не найдена!</NotFound>} loader={AssemblyLoader} />
            <Route path="/create_assembly" element={<CreateAssembly />} />
            <Route path="/create_component" element={<CreateComponent />} />
            <Route path="/*" element={<NotFound >Страница не найдена!</NotFound>} />
        </>
    ))

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}