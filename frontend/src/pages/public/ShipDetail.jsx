import { useParams } from "react-router-dom";

export default function ShipDetail() {
    const { id } = useParams();
    return <div className="p-10 text-center">Details for Ship ID: {id}</div>;
}