(function () {
    const config = window.SUPABASE_CONFIG;
    const root = document.getElementById('adminRoot');
    const client = window.supabase.createClient(config.url, config.publishableKey);
    let user;
    let currentView = 'dashboard';

    // Enhanced styling for improved dashboard
    const ENHANCED_STYLES = `
        <style>
            .admin-app {
                min-height: 100vh;
                background: var(--bg);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .admin-shell {
                display: grid;
                grid-template-columns: 280px 1fr;
                min-height: 100vh;
                gap: 24px;
                padding: 24px;
                background: linear-gradient(135deg, var(--bg) 0%, var(--surface) 100%);
            }

            .admin-sidebar {
                padding: 32px 20px;
                border-radius: 16px;
                background: var(--surface);
                border: 1px solid var(--line);
                box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
                position: sticky;
                top: 24px;
                max-height: calc(100vh - 48px);
                overflow-y: auto;
            }

            .admin-brand {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 40px;
                font-weight: 700;
                font-size: 1.2rem;
                color: var(--text);
            }

            .admin-brand img {
                width: 40px;
                height: 40px;
                object-fit: contain;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            }

            .admin-nav {
                display: grid;
                gap: 6px;
            }

            .admin-nav button {
                width: 100%;
                border: none;
                background: transparent;
                color: var(--text-muted);
                padding: 14px 16px;
                border-radius: 10px;
                text-align: right;
                cursor: pointer;
                font: inherit;
                font-size: 0.95rem;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            .admin-nav button:hover {
                color: var(--text);
                background: var(--surface-2);
                transform: translateX(-4px);
            }

            .admin-nav button.active {
                color: var(--accent, #d2a85a);
                background: rgba(210, 168, 90, 0.1);
                border-left: 3px solid var(--accent, #d2a85a);
                padding-left: 13px;
                font-weight: 600;
            }

            .admin-main {
                padding: 36px;
                border-radius: 16px;
                background: color-mix(in srgb, var(--surface) 92%, transparent);
                border: 1px solid var(--line);
                box-shadow: 0 20px 48px rgba(0, 0, 0, 0.08);
                overflow-y: auto;
                max-height: calc(100vh - 48px);
            }

            .admin-topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
                margin-bottom: 32px;
                padding-bottom: 20px;
                border-bottom: 2px solid var(--line);
            }

            .admin-topbar h1 {
                margin: 0;
                font-size: 1.8rem;
                color: var(--text);
            }

            .admin-user {
                color: var(--text-muted);
                font-size: 0.9rem;
                background: var(--surface-2);
                padding: 8px 16px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .admin-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 20px;
                margin-bottom: 32px;
            }

            .admin-stat {
                border: 1px solid var(--line);
                background: var(--surface);
                border-radius: 12px;
                padding: 24px;
                transition: all 0.3s ease;
            }

            .admin-stat:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
                border-color: var(--accent, #d2a85a);
            }

            .admin-stat span {
                display: block;
                color: var(--text-muted);
                font-size: 0.85rem;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .admin-stat strong {
                display: block;
                font-size: 2.4rem;
                color: var(--accent, #d2a85a);
                font-weight: 700;
            }

            .admin-panel-card {
                border: 1px solid var(--line);
                background: var(--surface);
                border-radius: 12px;
                padding: 28px;
                margin-bottom: 24px;
            }

            .admin-panel-card h2 {
                margin-top: 0;
                margin-bottom: 20px;
                font-size: 1.3rem;
                color: var(--text);
            }

            .admin-table-wrap {
                overflow-x: auto;
                border-radius: 8px;
            }

            .admin-table {
                width: 100%;
                border-collapse: collapse;
                min-width: 600px;
            }

            .admin-table th {
                background: var(--surface-2);
                color: var(--text);
                font-weight: 600;
                padding: 14px 12px;
                text-align: right;
                border-bottom: 2px solid var(--line);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .admin-table td {
                padding: 14px 12px;
                border-bottom: 1px solid var(--line);
                text-align: right;
            }

            .admin-table tr:hover {
                background: var(--surface-2);
            }

            .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid var(--line);
                border-top-color: var(--accent, #d2a85a);
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            @media (max-width: 1024px) {
                .admin-shell {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }

                .admin-sidebar {
                    position: static;
                    max-height: none;
                }

                .admin-main {
                    max-height: none;
                }

                .admin-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (max-width: 640px) {
                .admin-shell {
                    padding: 12px;
                    gap: 12px;
                }

                .admin-sidebar {
                    padding: 16px 12px;
                }

                .admin-main {
                    padding: 16px;
                }

                .admin-topbar {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .admin-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[char]));

    const message = (text) => `<p class="admin-message" role="status">${esc(text)}</p>`;
    const query = async (table, columns = '*') => {
        const result = await client.from(table).select(columns);
        if (result.error) throw result.error;
        return result.data || [];
    };

    function login(error = '') {
        root.innerHTML = `${ENHANCED_STYLES}
        <main class="admin-login">
            <div class="admin-panel-card">
                <div class="eyebrow">KATANBUILD ACCOUNTING</div>
                <h1>دخول لوحة المحاسبة</h1>
                <p class="admin-user">🔐 تسجيل الدخول الآمن</p>
                ${error ? message(`خطأ: ${error}`) : ''}
                <form>
                    <div class="admin-field">
                        <label for="email">البريد الإلكتروني</label>
                        <input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                    <div class="admin-field">
                        <label for="password">كلمة المرور</label>
                        <input id="password" type="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">دخول</button>
                </form>
            </div>
        </main>`;

        const form = root.querySelector('form');
        const email = root.querySelector('#email');
        const password = root.querySelector('#password');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                const result = await client.auth.signInWithPassword({
                    email: email.value.trim(),
                    password: password.value
                });
                if (result.error) throw result.error;
                user = result.data.user;
                await boot();
            } catch (err) {
                login(err.message);
            }
        });
    }

    async function profile() {
        const result = await client.from('profiles')
            .select('full_name, role, active')
            .eq('id', user.id)
            .single();
        if (result.error) throw result.error;
        return result.data;
    }

    function shell(account) {
        root.innerHTML = `${ENHANCED_STYLES}
        <div class="admin-shell">
            <aside class="admin-sidebar">
                <a class="admin-brand" href="index.html">
                    <img src="assets/katanbuild-logo.png" alt="katanbuild">
                    <span>لوحة المحاسبة</span>
                </a>
                <nav class="admin-nav">
                    <button data-view="dashboard">📊 نظرة عامة</button>
                    <button data-view="orders">📋 الطلبات</button>
                    <button data-view="payments">💳 إيصالات الدفع</button>
                    <button data-view="customers">👥 الزبائن والخصومات</button>
                    <button data-view="products">📦 المواد والأقسام</button>
                    <button data-view="inventory">📈 جرد المخزون</button>
                    <button data-view="finance">💰 المالية</button>
                    <button data-view="reps">🚀 المندوبون</button>
                    <button data-view="reports">📊 التقارير</button>
                    <button data-view="users">⚙️ إدارة المستخدمين</button>
                    <button id="logout" style="margin-top: 20px; color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; padding: 12px;">🚪 تسجيل الخروج</button>
                </nav>
            </aside>
            <main class="admin-main">
                <div class="admin-topbar">
                    <h1 id="viewTitle">نظرة عامة</h1>
                    <div class="admin-user">👤 ${esc(account.full_name)} • ${esc(account.role)}</div>
                </div>
                <div id="viewContent"></div>
            </main>
        </div>`;

        root.querySelector('#logout').addEventListener('click', async () => {
            await client.auth.signOut();
            login();
        });

        root.querySelectorAll('[data-view]').forEach((button) =>
            button.addEventListener('click', () => show(button.dataset.view))
        );

        client.channel('admin-orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                if (currentView === 'orders') show('orders');
            })
            .subscribe();

        show('dashboard');
    }

    async function show(view) {
        currentView = view;
        const titles = {
            dashboard: '📊 نظرة عامة',
            orders: '📋 الطلبات',
            payments: '💳 إيصالات الدفع',
            customers: '👥 الزبائن والخصومات',
            products: '📦 المواد والأقسام',
            inventory: '📈 جرد المخزون',
            finance: '💰 المالية',
            reps: '🚀 المندوبون',
            reports: '📊 التقارير',
            users: '⚙️ إدارة المستخدمين'
        };

        document.getElementById('viewTitle').textContent = titles[view];
        document.querySelectorAll('[data-view]').forEach((button) =>
            button.classList.toggle('active', button.dataset.view === view)
        );

        const content = document.getElementById('viewContent');
        content.innerHTML = `<div class="admin-panel-card"><div class="loading-spinner"></div> جار تحميل البيانات...</div>`;

        try {
            if (view === 'dashboard') await dashboard(content);
            else if (view === 'orders') await orders(content);
            else if (view === 'payments') await payments(content);
            else if (view === 'customers') await customers(content);
            else if (view === 'products') await products(content);
            else if (view === 'inventory') await inventory(content);
            else if (view === 'finance') await finance(content);
            else if (view === 'reps') await reps(content);
            else if (view === 'reports') await reports(content);
            else if (view === 'users') await users(content);
        } catch (err) {
            content.innerHTML = `<div class="admin-panel-card" style="color: #ef4444;">❌ خطأ: ${esc(err.message)}</div>`;
        }
    }

    async function dashboard(content) {
        const counts = await Promise.all([
            'products', 'customers', 'orders', 'invoices', 'sales_reps'
        ].map(async (table) => [
            table,
            (await client.from(table).select('id', { count: 'exact' })).count || 0
        ]));

        const labels = {
            products: '📦 المواد',
            customers: '👥 الزبائن',
            orders: '📋 الطلبات',
            invoices: '📄 الفواتير',
            sales_reps: '🚀 المندوبون'
        };

        const stats = counts.map(([table, count]) =>
            `<div class="admin-stat">
                <span>${labels[table]}</span>
                <strong>${count}</strong>
            </div>`
        ).join('');

        content.innerHTML = `
            <div class="admin-grid">${stats}</div>
            <div class="admin-panel-card">
                <h2>📸 أقسام المنتجات مع الصور</h2>
                <div class="sections-grid" id="sectionsGallery"></div>
            </div>
        `;

        if (window.DynamicSections) {
            window.DynamicSections.load('sectionsGallery');
        }
    }

    async function orders(content) {
        const rows = await query('orders', 'id, customer_name, customer_phone, customer_address, customer_code, latitude, longitude, status, submitted_at');
        content.innerHTML = `<div class="admin-panel-card"><h2>قائمة الطلبات</h2>${table(rows, ['المعرف', 'اسم الزبون', 'رقم الهاتف', 'الحالة', 'التاريخ'], ['id', 'customer_name', 'customer_phone', 'status', 'submitted_at'])}</div>`;
    }

    async function payments(content) {
        const rows = await query('payment_submissions', 'id, invoice_reference, payer_name, payer_phone, amount, currency, receipt_path, status, created_at');
        content.innerHTML = `<div class="admin-panel-card"><h2>إيصالات الدفع</h2>${table(rows, ['المعرف', 'المستخدم', 'المبلغ', 'العملة', 'الحالة', 'التاريخ'], ['id', 'payer_name', 'amount', 'currency', 'status', 'created_at'])}</div>`;
    }

    async function customers(content) {
        const rows = await query('customers', 'id, name, phone, address, customer_code, kind, discount_percent, created_at');
        content.innerHTML = `<div class="admin-panel-card"><h2>الزبائن والخصومات</h2>${table(rows, ['المعرف', 'الاسم', 'الهاتف', 'النوع', 'الخصم %', 'التاريخ'], ['id', 'name', 'phone', 'kind', 'discount_percent', 'created_at'])}</div>`;
    }

    async function products(content) {
        const rows = await query('products', 'id, name_ar, sku, price, currency, stock_quantity, active');
        content.innerHTML = `<div class="admin-panel-card"><h2>المواد والأقسام</h2>${table(rows, ['المعرف', 'الاسم', 'الرمز', 'السعر', 'المخزون', 'النشط'], ['id', 'name_ar', 'sku', 'price', 'stock_quantity', 'active'])}</div>`;
    }

    async function inventory(content) {
        const rows = await query('products', 'id, name_ar, sku, stock_quantity, price, currency');
        content.innerHTML = `<div class="admin-panel-card"><h2>جرد المخزون</h2>${table(rows, ['المعرف', 'الاسم', 'الرمز', 'الكمية', 'السعر'], ['id', 'name_ar', 'sku', 'stock_quantity', 'price'])}</div>`;
    }

    async function finance(content) {
        const rows = await query('cash_transactions', 'direction, category, amount, currency, description, occurred_at');
        content.innerHTML = `<div class="admin-panel-card"><h2>المالية</h2>${table(rows, ['الاتجاه', 'الفئة', 'المبلغ', 'العملة', 'الوصف', 'التاريخ'], ['direction', 'category', 'amount', 'currency', 'description', 'occurred_at'])}</div>`;
    }

    async function reps(content) {
        const rows = await query('sales_reps', 'name, phone, active, created_at');
        content.innerHTML = `<div class="admin-panel-card"><h2>المندوبون</h2>${table(rows, ['الاسم', 'الهاتف', 'نشط', 'التاريخ'], ['name', 'phone', 'active', 'created_at'])}</div>`;
    }

    async function reports(content) {
        const rows = await query('rep_daily_reports', 'report_date, new_customers, orders_count, sales_total');
        content.innerHTML = `<div class="admin-panel-card"><h2>التقارير اليومية</h2>${table(rows, ['التاريخ', 'الزبائن الجدد', 'عدد الطلبات', 'إجمالي المبيعات'], ['report_date', 'new_customers', 'orders_count', 'sales_total'])}</div>`;
    }

    async function users(content) {
        const rows = await query('profiles', 'id, full_name, phone, role, active, created_at');
        content.innerHTML = `<div class="admin-panel-card"><h2>المستخدمون</h2>${table(rows, ['المعرف', 'الاسم', 'الهاتف', 'الدور', 'نشط', 'التاريخ'], ['id', 'full_name', 'phone', 'role', 'active', 'created_at'])}</div>`;
    }

    function table(rows, headings, values) {
        return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr>${headings.map((heading) => `<th>${heading}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${values.map((val) => `<td>${esc(row[val])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }

    async function boot() {
        const session = await client.auth.getSession();
        user = session.data.session?.user;
        if (!user) return login();

        const account = await profile();
        if (!account.active || !['admin', 'owner'].includes(account.role)) {
            return login('ليس لديك صلاحيات الدخول');
        }

        shell(account);
    }

    boot().catch((error) => login(error.message));
})();
