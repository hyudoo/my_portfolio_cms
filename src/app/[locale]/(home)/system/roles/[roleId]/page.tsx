'use client';

import { RoleForm } from '@/components/role/role-form/RoleForm';
import { RolePermissionsMatrix } from '@/components/role/role-permissions-matrix/RolePermissionsMatrix';
import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { permissionRequest } from '@/requests/permission.request';
import { roleRequest } from '@/requests/role.request';
import { PermissionEntity } from '@/types/entities/permission.entitty';
import { RoleDetail, UpdateRoleBody } from '@/types/requests/role.type';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function RoleDetailPage() {
  const t = useTranslations();
  const modal = useAppModal();
  const params = useParams();
  const roleId = Number(params.roleId);

  const [role, setRole] = useState<RoleDetail | null>(null);
  const [allPermissions, setAllPermissions] = useState<PermissionEntity[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchRole = useCallback(async () => {
    try {
      const res = await roleRequest.detail(roleId);
      setRole(res.role);
      setSelectedIds((res.role.permissions ?? []).map((p) => p.id));
    } catch {}
  }, [roleId]);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await permissionRequest.list({ skip: 0, take: 200 });
      setAllPermissions(res.permissions);
    } catch {}
  }, []);

  useEffect(() => {
    fetchRole();
    fetchPermissions();
  }, [fetchRole, fetchPermissions]);

  const handleEditInfo = () => {
    if (!role) return;
    const formDataRef = { current: { name: role.name, isDefault: role.isDefault } as Partial<UpdateRoleBody> };
    modal.show({
      title: t('roles.modal.edit_title'),
      children: (
        <RoleForm
          initialValue={{ name: role.name, isDefault: role.isDefault }}
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.name) {
          notify.error(t('roles.validation.name_required'));
          throw new Error('validation');
        }
        await roleRequest.update(roleId, formDataRef.current);
        notify.success(t('roles.messages.updated'));
        await fetchRole();
      },
    });
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      await roleRequest.update(roleId, { permissions: selectedIds.map((id) => ({ id })) });
      notify.success(t('roles.messages.updated'));
    } finally {
      setSaving(false);
    }
  };

  if (!role) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-1">
        <Link
          href="/system/roles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('roles.detail.back')}
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>
          {role.isDefault && (
            <Badge className="bg-sky-500/20 text-sky-600 border-sky-500/30 hover:bg-sky-500/20">
              {t('roles.table.default_badge')}
            </Badge>
          )}
          <Button variant="ghost" size="icon" onClick={handleEditInfo} title={t('common.edit')}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">{t('roles.detail.subtitle')}</p>
      </div>

      <Card className="glass border-glass-border">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{t('roles.modal.tab_permissions')}</p>
            <Button onClick={handleSavePermissions} disabled={saving} size="sm">
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </div>
          <RolePermissionsMatrix allPermissions={allPermissions} selectedIds={selectedIds} onChange={setSelectedIds} />
        </div>
      </Card>
    </div>
  );
}
