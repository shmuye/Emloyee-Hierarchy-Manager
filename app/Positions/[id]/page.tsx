import PositionDetail from "@/components/PositionDetail";
import ProtectedRoute from "@/components/ProtectedRoute";

const Position = () => {
    return (
        <ProtectedRoute>
            <div className="flex justify-center">
                <PositionDetail />
            </div>
        </ProtectedRoute>
    );
};

export default Position;
