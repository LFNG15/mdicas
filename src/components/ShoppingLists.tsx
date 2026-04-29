import Link from 'next/link';
import Image from 'next/image';
import type { ShoppingList, ShoppingListItem } from '@/hooks/useShoppingLists';
import { safeUrlOrNull } from '@/lib/security/sanitize';

interface Props {
  lists: ShoppingList[];
}

export default function ShoppingLists({ lists }: Props) {
  if (lists.length === 0) return null;

  return (
    <section className="listas-section" id="listas">
      <div className="listas-inner">
        <div className="section-header">
          <div className="section-tag">Curadoria</div>
          <h2 className="section-title">Listas de Compra</h2>
          <p className="section-subtitle">
            Seleções cuidadosas com os melhores produtos e os melhores preços para você
          </p>
        </div>

        <div className="listas-aviso">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Como Associada da Amazon, ganho comissões com compras qualificadas feitas através dos links desta página, sem custo adicional para você.
        </div>

        <div className="listas-grid">
          {lists.map(list => (
            <div key={list.id} className="lista-card">
              <div className="lista-card-header">
                <span className="lista-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </span>
                <h3 className="lista-card-title">{list.name}</h3>
                <span className="lista-count">{list.items?.length ?? 0} itens</span>
              </div>

              <ul className="lista-items">
                {list.items?.slice(0, 5).map((item: ShoppingListItem) => {
                  const safeHref = safeUrlOrNull(item.affiliate_url);
                  const safeImg = safeUrlOrNull(item.image_url);
                  if (!safeHref) return null;
                  return (
                    <li key={item.id} className="lista-item">
                      <a
                        href={safeHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="lista-item-link"
                      >
                        {safeImg && (
                          <div className="lista-item-img">
                            <Image
                              src={safeImg}
                              alt={`Foto do produto ${item.name} disponível na Amazon`}
                              width={64}
                              height={64}
                              sizes="64px"
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>
                        )}
                        <div className="lista-item-info">
                          <span className="lista-item-name">{item.name}</span>
                          <span className="lista-item-amazon">Ver na Amazon →</span>
                        </div>
                        <span className="lista-item-arrow">→</span>
                      </a>
                    </li>
                  );
                })}
                {(list.items?.length ?? 0) > 5 && (
                  <li className="lista-item-more">
                    +{(list.items?.length ?? 0) - 5} mais itens
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/listas" className="btn-outline">
            Ver todas as listas →
          </Link>
        </div>
      </div>
    </section>
  );
}
