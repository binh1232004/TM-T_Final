import Image from 'next/image';
import Link from 'next/link'
export default function Home() {
    return (
        <div>
            <button className="text-white font-bold bg-blue-500 rounded px-3 py-2 m-5">
               <Link href="/detailPage">
        Detail Page
        </Link> 
            </button>
        </div>
    );
}
