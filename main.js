const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("paginated-list");
const listItems = [...paginatedList.querySelectorAll("li")];

const paginationLimit = 10;
const visiblePageCount = 5; // Number of numbered buttons shown at once
const pageCount = Math.ceil(listItems.length / paginationLimit);
let currentPage = 1;

const createButton = (label, options = {}) => {
  const button = document.createElement("button");
  button.textContent = label;
  button.className = options.className || "";
  if (options.disabled) button.disabled = true;
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      button.dataset[key] = value;
    });
  }
  return button;
};

const renderPaginationButtons = () => {
  paginationNumbers.innerHTML = "";
  const fragment = document.createDocumentFragment();

  // Prev button
  const prevBtn = createButton("Prev", {
    className: "pagination-prev",
    disabled: currentPage === 1,
  });
  prevBtn.addEventListener("click", () => setCurrentPage(currentPage - 1));
  fragment.appendChild(prevBtn);

  // Calculate page range to show
  const half = Math.floor(visiblePageCount / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(pageCount, currentPage + half);

  if (currentPage <= half) {
    end = Math.min(pageCount, visiblePageCount);
  } else if (currentPage + half > pageCount) {
    start = Math.max(1, pageCount - visiblePageCount + 1);
  }

  // Ellipsis at start
  if (start > 1) {
    fragment.appendChild(
      createButton("1", {
        dataset: { pageIndex: 1 },
        className: "pagination-number",
      })
    );
    const dots = createButton("...", { className: "dots", disabled: true });
    fragment.appendChild(dots);
  }

  // Page number buttons
  for (let i = start; i <= end; i++) {
    const pageBtn = createButton(i, {
      dataset: { pageIndex: i },
      className: `pagination-number${i === currentPage ? " active" : ""}`,
    });
    pageBtn.addEventListener("click", () => setCurrentPage(i));
    fragment.appendChild(pageBtn);
  }

  // Ellipsis at end
  if (end < pageCount) {
    const dots = createButton("...", { className: "dots", disabled: true });
    fragment.appendChild(dots);
    fragment
      .appendChild(
        createButton(pageCount, {
          dataset: { pageIndex: pageCount },
          className: "pagination-number",
        })
      )
      .addEventListener("click", () => setCurrentPage(pageCount));
  }

  // Next button
  const nextBtn = createButton("Next", {
    className: "pagination-next",
    disabled: currentPage === pageCount,
  });
  nextBtn.addEventListener("click", () => setCurrentPage(currentPage + 1));
  fragment.appendChild(nextBtn);

  paginationNumbers.appendChild(fragment);
};

const setCurrentPage = (pageNum) => {
  currentPage = Math.max(1, Math.min(pageNum, pageCount));
  renderPaginationButtons();

  const start = (currentPage - 1) * paginationLimit;
  const end = currentPage * paginationLimit;

  listItems.forEach((item, index) => {
    item.classList.toggle("hidden", index < start || index >= end);
  });
};

window.addEventListener("load", () => {
  renderPaginationButtons();
  setCurrentPage(1);
});
