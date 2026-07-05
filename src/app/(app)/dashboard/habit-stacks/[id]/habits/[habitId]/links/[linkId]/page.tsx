"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GetHabitLinksComponentsByHabitId, DeleteHabitLinks } from "@/lib/api/section-b/habit-link";
import { DeleteHabitLinkItem, GetDataHabitLinkItemsScreen } from "@/lib/api/section-b/habit-link-item";
import type { HabitLinkComponent, HabitLinkItemComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { DataState } from "@/components/dashboard/data-state";
import { HabitLinkItemDialog } from "@/components/dashboard/habit-link-item-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HabitLinkDetailPage() {
  const params = useParams<{ id: string; habitId: string; linkId: string }>();
  const router = useRouter();

  const [link, setLink] = useState<HabitLinkComponent | null>(null);
  const [items, setItems] = useState<HabitLinkItemComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(() => {
    GetDataHabitLinkItemsScreen({ docid: params.linkId }).then((res) => {
      setItems(Array.isArray(res.data) ? res.data : []);
    });
  }, [params.linkId]);

  useEffect(() => {
    Promise.all([GetHabitLinksComponentsByHabitId({ habitId: params.habitId }), GetDataHabitLinkItemsScreen({ docid: params.linkId })])
      .then(([linksRes, itemsRes]) => {
        const found = Array.isArray(linksRes.data)
          ? linksRes.data.find((l: HabitLinkComponent) => (l.documentId ?? l.id) === params.linkId)
          : null;
        if (found) {
          setLink(found);
        } else {
          setError("Unable to load this habit link.");
        }
        setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      })
      .finally(() => setLoading(false));
  }, [params.habitId, params.linkId]);

  async function handleDeleteLink() {
    const res = await DeleteHabitLinks({ id: params.linkId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Habit link deleted.");
      router.push(`/dashboard/habit-stacks/${params.id}/habits/${params.habitId}`);
      router.refresh();
    } else {
      toast.error("Unable to delete habit link.");
    }
  }

  async function handleDeleteItem(itemId: string) {
    const res = await DeleteHabitLinkItem({ id: itemId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Item deleted.");
      loadItems();
    } else {
      toast.error("Unable to delete item.");
    }
  }

  return (
    <DataState loading={loading} error={error}>
      {link ? (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{link.name}</h1>
              {link.company ? <p className="mt-1 text-sm text-muted-foreground">{link.company}</p> : null}
              <div className="mt-2">
                <ScoreBadge scoreInfo={link.scoreComponent?.scoreInfo} />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button asChild variant="outline" size="icon">
                <Link href={`/dashboard/habit-stacks/${params.id}/habits/${params.habitId}/links/${params.linkId}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this habit link?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes &quot;{link.name}&quot; and every item inside it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteLink}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Items</h2>
            <HabitLinkItemDialog
              habitLinkId={params.linkId}
              onSaved={loadItems}
              trigger={
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              }
            />
          </div>

          <DataState loading={false} error={null} empty={items.length === 0} emptyMessage="No items on this link yet.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.documentId ?? item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.companyName ?? "—"}</TableCell>
                    <TableCell>{item.price != null ? `$${item.price}` : "—"}</TableCell>
                    <TableCell>{item.quantity ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <HabitLinkItemDialog
                          habitLinkId={params.linkId}
                          item={item}
                          onSaved={loadItems}
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.documentId ?? item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataState>
        </div>
      ) : null}
    </DataState>
  );
}
