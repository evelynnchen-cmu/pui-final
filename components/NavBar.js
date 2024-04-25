import Image from 'next/image';

export default function NavBar() {
    return (
        <nav>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2 text-mc-green">
                <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse mc-font">
                    <Image src="/bed.png" width={40} height={40} alt="Bedwars Benchmark Logo of a green minecraft bed" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap">Bedwars Benchmark</span>
                </a>
            </div>
        </nav>
    );
}