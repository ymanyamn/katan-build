/* Dynamic Section Content Loader - يجلب محتوى الأقسام والصور من الإنترنت */

(function () {
    // Section data structure with dynamic image URLs
    const SECTIONS_DATA = [
        {
            slug: 'render-plaster-materials',
            nameAr: 'مواد الطينة',
            nameEn: 'Render & Plaster',
            descriptionAr: 'مواد طينة وتسوية متقدمة',
            descriptionEn: 'Advanced render and plaster materials',
            imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop&q=80',
            items: [
                { nameAr: 'طينة إسمنتية داخلية', nameEn: 'Interior Cement Render' },
                { nameAr: 'طينة خارجية مقاومة', nameEn: 'Weather Resistant Exterior' },
                { nameAr: 'مادة تسوية الجدران', nameEn: 'Wall Leveling Compound' },
                { nameAr: 'طينة ديكورية ناعمة', nameEn: 'Decorative Smooth Plaster' }
            ]
        },
        {
            slug: 'waterproofing-materials',
            nameAr: 'مواد العزل',
            nameEn: 'Waterproofing',
            descriptionAr: 'حماية فعالة من الرطوبة والماء',
            descriptionEn: 'Effective moisture and water protection',
            imageUrl: 'https://images.unsplash.com/photo-1576584522369-7ecbb60d0dc3?w=600&h=400&fit=crop&q=80',
            items: [
                { nameAr: 'عزل أسطح مرن', nameEn: 'Flexible Roof Waterproofing' },
                { nameAr: 'عزل حمامات ومطابخ', nameEn: 'Bathroom & Kitchen Waterproofing' },
                { nameAr: 'عزل خزانات المياه', nameEn: 'Water Tank Waterproofing' },
                { nameAr: 'معالجة الرطوبة', nameEn: 'Moisture Treatment' }
            ]
        },
        {
            slug: 'ceramic-adhesive-grout',
            nameAr: 'لواصق السيراميك',
            nameEn: 'Ceramic & Tile Systems',
            descriptionAr: 'لصق وروبة عالية الأ��اء',
            descriptionEn: 'High-performance adhesive and grout',
            imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop&q=80',
            items: [
                { nameAr: 'لاصق إسمنتي C1', nameEn: 'Cement Adhesive C1' },
                { nameAr: 'لاصق محسن C2', nameEn: 'Enhanced Adhesive C2' },
                { nameAr: 'لاصق مرن C2F', nameEn: 'Flexible Adhesive C2F' },
                { nameAr: 'روبة ملموسة', nameEn: 'Concrete Grout' }
            ]
        },
        {
            slug: 'thermal-insulation-materials',
            nameAr: 'العزل الحراري',
            nameEn: 'Thermal Insulation',
            descriptionAr: 'توفير الطاقة وراحة حرارية',
            descriptionEn: 'Energy efficiency and thermal comfort',
            imageUrl: 'https://images.unsplash.com/photo-1577720577886-d8ac8e7e3fdc?w=600&h=400&fit=crop&q=80',
            items: [
                { nameAr: 'ألواح عزل للواجهات', nameEn: 'Facade Insulation Panels' },
                { nameAr: 'لاصق ألواح العزل', nameEn: 'Panel Bonding Adhesive' },
                { nameAr: 'شبك تسليح الواجهات', nameEn: 'Facade Reinforcement Mesh' },
                { nameAr: 'طبقة تسوية حرارية', nameEn: 'Thermal Leveling Layer' }
            ]
        }
    ];

    // Fetch and display sections with images
    async function loadSectionsWithImages(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const lang = window.currentLang?.() || 'ar';

        container.innerHTML = '<div class="sections-loading">⏳ جار تحميل الأقسام...</div>';

        try {
            const sectionCards = await Promise.all(
                SECTIONS_DATA.map(async (section) => {
                    try {
                        // Test image URL
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = section.imageUrl;
                        });

                        return createSectionCard(section, lang);
                    } catch (err) {
                        console.warn(`Failed to load image for ${section.slug}, using fallback`);
                        return createSectionCard(section, lang, true);
                    }
                })
            );

            container.innerHTML = `<div class="sections-grid">${sectionCards.join('')}</div>`;
        } catch (err) {
            container.innerHTML = `<div class="sections-error">❌ خطأ في تحميل الأقسام: ${err.message}</div>`;
        }
    }

    // Create section card HTML
    function createSectionCard(section, lang, useFallback = false) {
        const name = lang === 'ar' ? section.nameAr : section.nameEn;
        const desc = lang === 'ar' ? section.descriptionAr : section.descriptionEn;
        const imageUrl = useFallback ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Crect fill="%23e5e7eb" width="600" height="400"/%3E%3C/svg%3E' : section.imageUrl;

        const itemsHtml = section.items
            .map(item => {
                const itemName = lang === 'ar' ? item.nameAr : item.nameEn;
                return `<li style="color: var(--text-muted); padding: 6px 0; font-size: 0.9rem;">✓ ${itemName}</li>`;
            })
            .join('');

        return `
            <div class="section-card" data-section="${section.slug}">
                <div class="section-image-wrapper">
                    <img src="${imageUrl}" alt="${name}" loading="lazy" class="section-image" />
                    <div class="section-overlay">
                        <span class="section-badge">📸 ${name}</span>
                    </div>
                </div>
                <div class="section-content">
                    <h3>${name}</h3>
                    <p class="section-description">${desc}</p>
                    <ul class="section-items" style="list-style: none; padding: 0; margin: 12px 0;">
                        ${itemsHtml}
                    </ul>
                    <a href="product.html?slug=${section.slug}" class="section-link" style="display: inline-block; margin-top: 12px; color: var(--accent, #d2a85a); font-weight: 600; text-decoration: none;">
                        عرض المزيد →
                    </a>
                </div>
            </div>
        `;
    }

    // Get section details by slug
    function getSectionBySlug(slug) {
        return SECTIONS_DATA.find(s => s.slug === slug);
    }

    // Get all sections
    function getAllSections() {
        return SECTIONS_DATA;
    }

    // Get random section image
    function getRandomSectionImage() {
        const section = SECTIONS_DATA[Math.floor(Math.random() * SECTIONS_DATA.length)];
        return section.imageUrl;
    }

    // Update section product images from internet
    async function updateProductImages() {
        const images = SECTIONS_DATA.map(s => ({
            section: s.slug,
            image: s.imageUrl
        }));
        return images;
    }

    // Public API
    window.DynamicSections = {
        load: loadSectionsWithImages,
        getSectionBySlug: getSectionBySlug,
        getAllSections: getAllSections,
        getRandomImage: getRandomSectionImage,
        updateImages: updateProductImages
    };

    // Auto-load on DOM ready if target element exists
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('sectionsContainer')) {
            loadSectionsWithImages('sectionsContainer');
        }
    });
})();
