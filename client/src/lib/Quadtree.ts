/**
 * Quadtree - XZ düzleminde O(log n) mekansal sorgu.
 * Bina yerleştirme çarpışma kontrolü için kullanılır.
 */

/** Sınır dikdörtgeni */
export interface QRect {
  x: number;
  z: number;
  w: number;
  h: number;
}

/** Quadtree düğüm verisi */
export interface QPoint {
  id: string;
  x: number;
  z: number;
}

const MAX_OBJECTS = 8;
const MAX_DEPTH = 6;

/**
 * @description Hafif quadtree implementasyonu.
 *   insert, query (alan) ve remove destekler.
 */
export class Quadtree {
  private bounds: QRect;
  private depth: number;
  private objects: QPoint[] = [];
  private children: Quadtree[] | null = null;

  constructor(bounds: QRect, depth = 0) {
    this.bounds = bounds;
    this.depth = depth;
  }

  /** Tüm düğümleri temizle */
  clear(): void {
    this.objects = [];
    this.children = null;
  }

  /** Nokta ekle */
  insert(point: QPoint): boolean {
    try {
      if (!this.contains(point)) return false;

      if (this.children === null) {
        this.objects.push(point);
        if (this.objects.length > MAX_OBJECTS && this.depth < MAX_DEPTH) {
          this.subdivide();
        }
        return true;
      }

      for (const child of this.children) {
        if (child.insert(point)) return true;
      }
      return false;
    } catch (e) {
      console.error("[Quadtree] insert hatası:", e);
      return false;
    }
  }

  /** Belirtilen alandaki tüm noktaları bul */
  query(range: QRect): QPoint[] {
    try {
      const found: QPoint[] = [];

      if (!this.intersects(range)) return found;

      for (const obj of this.objects) {
        if (
          obj.x >= range.x &&
          obj.x <= range.x + range.w &&
          obj.z >= range.z &&
          obj.z <= range.z + range.h
        ) {
          found.push(obj);
        }
      }

      if (this.children !== null) {
        for (const child of this.children) {
          found.push(...child.query(range));
        }
      }
      return found;
    } catch (e) {
      console.error("[Quadtree] query hatası:", e);
      return [];
    }
  }

  /** Belirtilen merkez ve yarıçap içindeki noktalar */
  queryRadius(cx: number, cz: number, radius: number): QPoint[] {
    try {
      const range: QRect = {
        x: cx - radius,
        z: cz - radius,
        w: radius * 2,
        h: radius * 2,
      };
      const candidates = this.query(range);
      const rSq = radius * radius;
      return candidates.filter((p) => {
        const dx = p.x - cx;
        const dz = p.z - cz;
        return dx * dx + dz * dz <= rSq;
      });
    } catch {
      return [];
    }
  }

  /** Nokta ID'ye göre sil */
  remove(id: string): boolean {
    try {
      const idx = this.objects.findIndex((o) => o.id === id);
      if (idx !== -1) {
        this.objects.splice(idx, 1);
        return true;
      }

      if (this.children !== null) {
        for (const child of this.children) {
          if (child.remove(id)) return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  private subdivide(): void {
    const { x, z, w, h } = this.bounds;
    const hw = w / 2;
    const hh = h / 2;
    const d = this.depth + 1;

    this.children = [
      new Quadtree({ x, z, w: hw, h: hh }, d),
      new Quadtree({ x: x + hw, z, w: hw, h: hh }, d),
      new Quadtree({ x, z: z + hh, w: hw, h: hh }, d),
      new Quadtree({ x: x + hw, z: z + hh, w: hw, h: hh }, d),
    ];

    // Mevcut nesneleri dağıt
    for (const obj of this.objects) {
      for (const child of this.children) {
        if (child.insert(obj)) break;
      }
    }
    this.objects = [];
  }

  private contains(point: QPoint): boolean {
    return (
      point.x >= this.bounds.x &&
      point.x <= this.bounds.x + this.bounds.w &&
      point.z >= this.bounds.z &&
      point.z <= this.bounds.z + this.bounds.h
    );
  }

  private intersects(range: QRect): boolean {
    return !(
      range.x > this.bounds.x + this.bounds.w ||
      range.x + range.w < this.bounds.x ||
      range.z > this.bounds.z + this.bounds.h ||
      range.z + range.h < this.bounds.z
    );
  }
}

/**
 * @description Oyun için global quadtree singleton.
 *   Harita boyutuna göre oluşturulur.
 */
export function createGameQuadtree(mapSize: number): Quadtree {
  const half = mapSize / 2;
  return new Quadtree({ x: -half, z: -half, w: mapSize, h: mapSize });
}
