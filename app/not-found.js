"use client";

import { Result } from "antd";
import Link from "next/link";

export default function Error() {
    return <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Link href="/" type="primary">Back Home</Link>}
    />;
}