/** One row of the backend `ClassConfigs` table — the starting stat line every
 *  new character of that class is created with. */
export interface ClassConfigResponse {
  classConfigId: number;
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
