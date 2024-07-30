"use client";

import React, { useEffect } from "react";

const RSSWidget = () => {
    return (
        <div>
            <rssapp-ticker id="4kVgcEbBUjqgnF15"></rssapp-ticker>
            <script
                src="https://widget.rss.app/v1/ticker.js"
                type="text/javascript"
                async
            ></script>
            <rssapp-imageboard id="4kVgcEbBUjqgnF15"></rssapp-imageboard>
            <script
                src="https://widget.rss.app/v1/imageboard.js"
                type="text/javascript"
                async
            ></script>
        </div>
    );
};

export default RSSWidget;
