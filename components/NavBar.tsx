import {Typography,Button} from "@mantine/core";
import AddPositionModal from "@/components/AddPositionModal";
import {bold} from "next/dist/lib/picocolors";
const NavBar = () => {
    return (
        <header className="py-4 px-2 bg-slate-800 text-white bg-card">
            <nav className="flex justify-between px-4">
                <h1 className="text-xl text- font-bold">Employee Hierarchy Mangager</h1>
                <div>
                    {/*<Button variant="outline">Add Position</Button>*/}
                    <AddPositionModal/>
                </div>
            </nav>
        </header>
    )
}
export default NavBar
