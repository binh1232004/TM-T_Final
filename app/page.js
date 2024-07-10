import { Image } from "antd";
import Link from "next/link";

export default function Home() {
    return (
        <div className="bg-site min-h-[600px]">
            <div className="mx-auto relative">
                <div className="flex flex-row justify-evenly items-center">
                    <div className="pt-8 md:pt-12 lg:pt-20 pb-8 md:pb-12 lg:pb-20">
                        <div className="container px-6 mx-auto text-center">
                            <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl">
                                Discover Your Style
                            </h1>
                            <div className="max-w-5xl mx-auto mt-2 text-lg font-light leading-tight text-gray-500 sm:text-xl md:text-2xl">
                                <p className="">
                                    Trendy Clothing and Accessories for Every
                                    Occasion. Elevate Your Wardrobe with Our
                                    Unique Selection of Fashion-Forward Apparel
                                    and Must-Have Accessories.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <Image src="./banner.jpg" preview={false} />
                </div>
                <div className="flex justify-center items-center bg-white/80">
                    <Image
                        src="./logo.png"
                        className="aspect-square object-fit max-h-96 rounded-lg mt-8"
                        preview={false}
                    />
                </div>
                <div className="flex gap-2 sm:gap-14 px-14 flex-col sm:flex-row justify-center items-center">
                    <div className="text-custom-1 text-center sm:text-left pt-10 sm:py-20 basis-1/2">
                        <h1 className="uppercase text-4xl sm:text-7xl text-center sm:text-left text-black">
                            K48 Shop
                        </h1>
                        <p className="text-lg my-10 text-black/50">
                            At K48, we pride ourselves on offering a carefully
                            curated collection of trendy clothing and
                            accessories designed to elevate your everyday look.
                            Whether you’re searching for the perfect outfit for
                            a special occasion or chic accessories to complement
                            your style, our diverse range has something for
                            everyone.
                        </p>
                        <div className="mt-10 sm:mt-[300px]">
                            <Link
                                href="/shirts"
                                className="h-auto max-w-full inline-block"
                            >
                                <div className="flex items-center justify-center h-full">
                                    <div className="overflow-hidden relative group w-full h-full">
                                        <Image
                                            width={700}
                                            height={700}
                                            src="./shirt.png"
                                            preview={false}
                                        ></Image>
                                    </div>
                                </div>
                            </Link>
                            <span className="font-bold text-2xl sm:text-5xl block text-center mt-[-15px] sm:mt-[-30px] text-black relative z-10">
                                Shirt
                            </span>
                        </div>
                    </div>
                    <div className="basis-1/2">
                        <div className="mt-10 sm:mt-[220px]">
                            <Link
                                href="/accessories"
                                className="h-auto max-w-full inline-block"
                            >
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-full h-full">
                                        <Image
                                            width={700}
                                            height={700}
                                            src="./hat.png"
                                            preview={false}
                                        ></Image>
                                    </div>
                                </div>
                            </Link>
                            <span className="font-bold text-2xl sm:text-5xl block text-center mt-[-15px] sm:mt-[-30px] relative z-10">
                                Accessories
                            </span>
                        </div>
                        <div className="mt-10 sm:mt-40">
                            <Link
                                href="/pants"
                                className="h-auto max-w-full inline-block"
                            >
                                <div className="flex items-center justify-center h-full">
                                    <div className="overflow-hidden relative group w-full h-full">
                                        <Image
                                            width={700}
                                            height={700}
                                            src="./pants.jpg"
                                            preview={false}
                                        ></Image>
                                    </div>
                                </div>
                            </Link>
                            <span className="font-bold text-2xl sm:text-5xl block text-center mt-[-15px] sm:mt-[-30px] relative z-10">
                                Pants
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-black h-96 mt-10 sm:mt-20">
                </div>
            </div>
        </div>
    );
}
