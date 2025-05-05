import {createRoot} from "react-dom/client";
import {SpSpa} from "pithekos-lib";
import App from "./App";
import './index.css';

/** FAB 56px + inset 20px + 4px to increase SpaSpa's bottom margin of 16px to match the inset = 80px */
createRoot(document.getElementById("root"))
    .render(
        <SpSpa
            requireNet={false}
            titleKey="pages:content:title"
            currentId="content"
            style={{marginBottom: '80px'}}
        >
            <App/>
        </SpSpa>
    );
