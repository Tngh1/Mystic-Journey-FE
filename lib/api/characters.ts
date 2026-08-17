export interface ClassConfigResponse {
  classConfigId: number;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className: string;
  maxHp: number;
  atk: number;
  def: number;
  moveSpeed: number;
  attackSpeed: number;
  critRate: number;
  critDamage: number;
  damageBonus: number;
}
