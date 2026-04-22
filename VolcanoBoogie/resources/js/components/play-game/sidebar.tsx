type Props = {
};

export default function Sidebar({
}: Props) {
    return (
        <div className="fixed inset-y-0 right-0 w-2/10 bg-stone-600 border-l shadow-lg">
            Right Sidebar Content
        </div>
    );
}