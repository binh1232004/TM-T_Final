"use client";

import React, { useEffect } from "react";

const RSSWidget = () => {
    return (
        <div>
            <rssapp-ticker id="zENnZfoFLiYVYLjt"></rssapp-ticker>
            <script
                src="https://widget.rss.app/v1/ticker.js"
                type="text/javascript"
                async
            ></script>
            <rssapp-imageboard id="zENnZfoFLiYVYLjt"></rssapp-imageboard>
            <script
                src="https://widget.rss.app/v1/imageboard.js"
                type="text/javascript"
                async
            ></script>
        </div>
    );
};

export default RSSWidget;
