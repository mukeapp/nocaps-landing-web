"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SaveHabitLinkItem, UpdateHabitLinkItem } from "@/lib/api/section-b/habit-link-item";
import type { HabitLinkItemComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HabitLinkItemDialog({
  habitLinkId,
  item,
  trigger,
  onSaved,
}: {
  habitLinkId: string;
  item?: HabitLinkItemComponent;
  trigger: React.ReactNode;
  onSaved: () => void;
}) {
  const isEditing = Boolean(item);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item?.name ?? "");
  const [companyName, setCompanyName] = useState(item?.companyName ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [quantity, setQuantity] = useState(item?.quantity?.toString() ?? "1");
  const [description, setDescription] = useState(item?.description ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give this item a name.");
      return;
    }

    const data = {
      ...item,
      habitLinkId,
      name,
      companyName,
      location,
      price: price ? Number(price) : undefined,
      quantity: quantity ? Number(quantity) : undefined,
      description,
    };

    setSaving(true);
    try {
      const res = isEditing
        ? await UpdateHabitLinkItem({ data: { ...data, id: item?.documentId ?? item?.id } })
        : await SaveHabitLinkItem({ data });

      if (res.status >= 200 && res.status < 300) {
        toast.success(isEditing ? "Item updated." : "Item added.");
        setOpen(false);
        onSaved();
      } else {
        toast.error("Unable to save item.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit item" : "Add item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="item-company">Store / company</Label>
              <Input id="item-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-location">Location</Label>
              <Input id="item-location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="item-price">Price</Label>
              <Input
                id="item-price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-quantity">Quantity</Label>
              <Input
                id="item-quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-description">Description</Label>
            <Textarea
              id="item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Save changes" : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
