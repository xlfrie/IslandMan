import {
    EntityItemComponent,
    EntityRemoveBeforeEvent,
    ItemStack,
    system,
    world,
} from "@minecraft/server";
import Event from "lib/types/Event";
import { Vector } from "lib/wrappers/Vector";
import { gameStateManager } from "main";
import Gameplay from "../Gameplay";

export default class ItemSacrifice implements Event {
    public name: string = "item-sacrifice";
    public eventSignal = world.beforeEvents.entityRemove;
    public execute = (event: EntityRemoveBeforeEvent) => {
        const entity = event.removedEntity;

        if (entity.typeId !== "minecraft:item") return 0;

        const location = entity.location;
        const dimension = entity.dimension;
        const block = dimension.getBlock(location);

        if (!entity.getComponent("onfire")) return 0;

        const itemComponent: EntityItemComponent | undefined =
            entity.getComponent("minecraft:item");

        if (!itemComponent) {
            console.warn("Burned item entity had no item component");
            return 0;
        }

        console.log(
            `Detected ${itemComponent.itemStack.amount} ${itemComponent.itemStack.typeId} burned`
        );

        const change = (<Gameplay>(
            gameStateManager.stateHandler
        )).quotaManager.deliverQuota(itemComponent.itemStack.amount);
        const typeId = itemComponent.itemStack.typeId;

        if (change) {
            system.run(() => {
                const item = dimension.spawnItem(
                    new ItemStack(typeId, change),
                    new Vector(location).add(0, 1.5, 0)
                );

                const yVelocity = 1;
                const hVelocity = 0.25;
                const theta = Math.random() * Math.PI * 2;
                let changeVelocity = new Vector(
                    Math.cos(theta) * hVelocity,
                    yVelocity,
                    Math.sin(theta) * hVelocity
                );

                item.clearVelocity();
                item.applyImpulse(changeVelocity.mul(0.5));
            });
        }

        return 0;
    };
}
