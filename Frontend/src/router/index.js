import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "", // Mặc định sẽ chuyển hướng đến trang user
        redirect: "/user"
    },
    {
        path: "/user",
        component: () => import("@/views/user/UserView.vue"),
        meta: { roles: ["user", "admin", ""] },
        children: [
            {
                path: "",
                redirect: "/user/books"
            },
            {
                path: "books",
                component: () => import("@/views/user/BookList.vue"),
            },
            {
                path: "borrow-history",
                component: () => import("@/views/user/BorrowHistory.vue"),
            }
        ],
    },
    {
        path: "/admin",
        component: () => import("@/views/admin/AdminView.vue"),
        meta: { roles: ["admin"] },
        children: [
            {
                path: "",
                redirect: "/admin/books"
            },
            {
                path: "books",
                component: () => import("@/views/admin/BooksManagement.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "add-book",
                component: () => import("@/components/book/AddBook.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-book/:id",
                component: () => import("@/components/book/EditBook.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "borrowing",
                component: () => import("@/views/admin/BorrowingManagement.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "add-borrowing",
                component: () => import("@/components/borrow/AddBorrow.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "readers",
                component: () => import("@/views/admin/ReadersManagement.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "add-reader",
                component: () => import("@/components/reader/AddReader.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-reader/:id",
                component: () => import("@/components/reader/EditReader.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "publishers",
                component: () => import("@/views/admin/PublisherManagement.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-publisher/:id",
                component: () => import("@/components/publisher/EditPublisher.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "add-publisher",
                component: () => import("@/components/publisher/AddPublisher.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "employees",
                component: () => import("@/views/admin/EmployeeManagement.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "add-employee",
                component: () => import("@/components/employee/AddEmployee.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-employee/:id",
                component: () => import("@/components/employee/EditEmployee.vue"),
                meta: { roles: ["admin"] }
            }
        ]
    },
    {
        path: "/user-login",
        component: () => import("@/views/auth/UserLogin.vue"),
    },
    {
        path: "/admin-login",
        component: () => import("@/views/auth/AdminLogin.vue"),
    },
    {
        path: "/not-authorized",
        component: () => import("@/views/NotAuthorized.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/views/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    // Lấy vai trò người dùng từ localstorage
    const userRole = localStorage.getItem("userRole");

    if (userRole === null && to.meta.roles?.length > 0) {
        // Nếu chưa đăng nhập thì chuyển đến trang đăng nhập
        next("/user-login");
    } else if (to.meta.roles?.includes(userRole) === false) {
        // Nếu người dùng có role không hơp lệ thì chuyển
        next("/not-authorized");
    } else {
        next();
    }
});

export default router;