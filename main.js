import { menuItems, mockUsers, roles } from "./constants.js";

$(document).ready(function () {
  const $sidebarList = $("#sidebar .c-list");
  const $filterByRole = $("#filterbyrole");
  const $searchbar = $("#searchbar");
  const $tbody = $(".c-table__body");
  const $modalOverlay = $(".c-overlay");
  const $modal = $("#generic-modal");
  const $modalActionButton = $("#modal-action-button");
  const $spinner = $("#spinner");

  // Show spinner while page is loading
  $spinner.show();

  // Generate the sidebar dynamically
  function generateSidebar() {
    menuItems.forEach((item) => {
      const listItem = createSidebarItem(item);
      $sidebarList.append(listItem);
    });
  }

  // Helper function to create a sidebar item
  function createSidebarItem(item) {
    const isActive = item.active ? "active" : "";
    return `
      <li class="c-list__item">
        <a href="${item.link}" class="${isActive}">
          <span class="material-symbols-sharp">${item.icon}</span>
          <h3>${item.title}</h3>
        </a>
      </li>
    `;
  }

  // Generate the role options dynamically
  function generateRoleOptions() {
    roles.forEach((role) => {
      const option = `<option>${role}</option>`;
      $filterByRole.append(option);
    });
  }

  // Sidebar toggle functionality
  $("#toggleBtn").click(function () {
    $("#sidebar").toggleClass("close");
  });

  // Check and load users from localStorage
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(mockUsers));
  }

  let users = JSON.parse(localStorage.getItem("users"));
  const usersPerPage = 5;
  let currentPage = 1;
  let filteredUsers = users;

  // Populate the table with users
  function populateTable() {
    $tbody.empty();

    if (filteredUsers.length === 0) {
      $("#no-users-message").text("There are no users available").show();
      $(".c-pagination").hide();
    } else {
      $("#no-users-message").hide();
      $(".c-pagination").show();

      const startIndex = (currentPage - 1) * usersPerPage;
      const endIndex = startIndex + usersPerPage;
      const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

      usersToDisplay.forEach((user) => {
        const row = createTableRow(user);
        $tbody.append(row);
      });

      updatePagination();
    }
  }

  // Helper function to create a table row
  function createTableRow(user) {
    return `
      <tr class="c-table__row">
        <td class="c-table__cell">${user.name}</td>
        <td class="c-table__cell">${user.email}</td>
        <td class="c-table__cell">${user.role}</td>
        <td class="c-table__cell">
          <button class="c-button c-button--brand c-button--small edit-btn">Edit</button>
          <button class="c-button c-button--error c-button--small delete-btn">Delete</button>
        </td>
      </tr>
    `;
  }

  // Function to update the pagination controls
  function updatePagination() {
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / usersPerPage);

    $(".c-pagination__pages").empty();

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = `<button class="c-pagination__control" data-page="${i}">${i}</button>`;
      $(".c-pagination__pages").append(pageButton);
    }

    $(".c-pagination__control").removeAttr("aria-current");
    $(`.c-pagination__control[data-page="${currentPage}"]`).attr(
      "aria-current",
      "page"
    );
  }

  // Handle page button click
  $(document).on("click", ".c-pagination__control", function () {
    const page = $(this).data("page");
    if (page) {
      currentPage = page;
      populateTable();
      updatePagination();
    }
  });

  // Handle next and previous buttons
  $(".c-pagination__control").click(function () {
    if ($(this).text() === "›") {
      if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
        currentPage++;
      }
    } else if ($(this).text() === "‹") {
      if (currentPage > 1) {
        currentPage--;
      }
    }
    populateTable();
    updatePagination();
  });

  // Search functionality
  $searchbar.on("input", function () {
    const query = $(this).val().toLowerCase();

    filteredUsers = users.filter((user) => {
      const matchesSearchQuery =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRoleFilter =
        $filterByRole.val() === "All" || user.role === $filterByRole.val();

      return matchesSearchQuery && matchesRoleFilter;
    });

    currentPage = 1;
    populateTable();
    updatePagination();
  });

  // Handle filter by role functionality
  $filterByRole.on("change", function () {
    const selectedRole = $(this).val();
    filteredUsers =
      selectedRole === "All"
        ? users
        : users.filter((user) => user.role === selectedRole);
    currentPage = 1;
    populateTable();
    updatePagination();
  });

  // Show the modal
  function showModal(title, actionText, actionType, index = null) {
    $("#modal-title").text(title);

    let roleOptions = "";
    roles.forEach((role) => {
      roleOptions += `<option value="${role}">${role}</option>`;
    });

    $("#modal-body").html(`
    <label for="modal-name">Name:</label>
    <input class="c-field" type="text" id="modal-name" />
    <label for="modal-email">Email:</label>
    <input class="c-field" type="text" id="modal-email" />
    <label for="modal-role">Role:</label>
    <select class="c-field" id="modal-role">
      ${roleOptions}
    </select>
  `);

    $modalActionButton.text(actionText);

    $modalOverlay.addClass("c-overlay--visible");
    $modal.addClass("o-modal--visible");

    if (actionType === "edit" || actionType === "delete") {
      $("#modal-name").val(filteredUsers[index].name);
      $("#modal-email").val(filteredUsers[index].email);
      $("#modal-role").val(filteredUsers[index].role);
    }

    $modalActionButton.off("click").on("click", function () {
      handleModalAction(actionType, index);
    });
  }

  // Function to show toast messages
  function showToast(message, type) {
    const toast = $(`
      <div role="alert" class="c-alert c-alert--${type}">${message}</div>
    `);
    $(".c-alerts").append(toast);

    setTimeout(() => {
      toast.fadeOut(() => {
        toast.remove();
      });
    }, 3000);
  }

  // Handle modal action (Add, Edit, Delete)
  function handleModalAction(actionType, index) {
    const name = $("#modal-name").val().trim();
    const email = $("#modal-email").val().trim();
    const role = $("#modal-role").val();

    if (!name || !email || !role) {
      showToast("All fields are required.", "error");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    // Action based on type (add, edit, delete)
    if (actionType === "add") {
      users.unshift({ name, email, role });
      showToast("User added successfully!", "success");
    } else if (actionType === "edit") {
      users[index] = { name, email, role };
      showToast("User edited successfully!", "info");
    } else if (actionType === "delete") {
      users.splice(index, 1);
      showToast("User deleted successfully!", "error");
    }

    // Update localStorage and UI
    localStorage.setItem("users", JSON.stringify(users));
    closeModal();
    filteredUsers = users;
    currentPage = 1;
    populateTable();
    updatePagination();
  }

  // Close the modal
  function closeModal() {
    $modalOverlay.removeClass("c-overlay--visible");
    $modal.removeClass("o-modal--visible");
  }

  // Close modal when the "X" button is clicked
  $(".close-modal").click(closeModal);

  // Show modal on add button click
  $(".add-btn").click(function () {
    showModal("Add User", "Add", "add");
  });

  // Show modal on edit button click
  $(document).on("click", ".edit-btn", function () {
    const index = $(this).closest("tr").index();
    showModal("Edit User", "Save", "edit", index);
  });

  // Show modal on delete button click
  $(document).on("click", ".delete-btn", function () {
    const index = $(this).closest("tr").index();
    showModal("Delete Confirmation", "Delete", "delete", index);
  });

  // Initial population of sidebar, roles, table, and pagination
  generateSidebar();
  generateRoleOptions();
  populateTable();
  updatePagination();

  // Hide spinner after content is ready
  $spinner.hide();
});
