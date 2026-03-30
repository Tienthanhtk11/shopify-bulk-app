(function () {
  "use strict";

  if (window.__subbulkThemeLoaderMounted) return;
  window.__subbulkThemeLoaderMounted = true;

  var runtimeId = "subbulk-widget-runtime-script";
  if (document.getElementById(runtimeId)) return;

  var script = document.createElement("script");
  script.id = runtimeId;
  script.src = "/apps/subbulk/widget-runtime";
  script.defer = true;
  script.setAttribute("data-subbulk-runtime", "true");
  document.head.appendChild(script);
})();
